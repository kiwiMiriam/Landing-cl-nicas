import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './registerPatients.module.css';
import kiwiTextGreenIcon from '../../assets/kiwiTextGreenLightIcon.svg';
import { ALLOWED_CLINICS, CLINIC_SEDES } from '../../constants/constants.clinicas';
import Footer from '../../components/footer/footer';

// Tipos
interface FormData {
  full_name_receptionist: string;
  full_name_client: string;
  headquarters_clinica: string;
  document_type: string;
  identification_number: string;
  average_income: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}


const RegisterPatients: React.FC = () => {
  const navigate = useNavigate();
  const { clinicId } = useParams<{ clinicId: string }>();

  // Obtener las sedes de la clínica seleccionada
  const clinicSedes = clinicId ? CLINIC_SEDES[clinicId] || [] : [];
  
  // Determinar si la clínica tiene una sola sede
  const hasSingleLocation = clinicSedes.length === 1;
  const singleLocation = hasSingleLocation ? clinicSedes[0] : '';

  // Estado para controlar si la clínica es válida
  const [isValidClinic, setIsValidClinic] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(true);

  // Validar que la clínica exista en nuestras constantes permitidas
  useEffect(() => {
    const validateClinic = () => {
      setIsValidating(true);
      if (!clinicId || !Object.values(ALLOWED_CLINICS).includes(clinicId as any)) {
        setIsValidClinic(false);
        // Redireccionar a not-found después de validar
        navigate('/not-found', { replace: true });
      } else {
        setIsValidClinic(true);
        
        // Si hay una sola sede, asignarla automáticamente al formulario
        if (hasSingleLocation) {
          setFormData(prev => ({
            ...prev,
            headquarters_clinica: singleLocation
          }));
        }
      }
      setIsValidating(false);
    };

    validateClinic();
  }, [clinicId, navigate, hasSingleLocation, singleLocation]);

  // Inicializar el formulario, autocompletando la sede si hay una única
  const [formData, setFormData] = useState<FormData>({
    full_name_receptionist: '',
    full_name_client: '',
    headquarters_clinica: hasSingleLocation ? singleLocation : '',
    document_type: '',
    identification_number: '',
    average_income: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

   const tipoDocumentoOptions = [
    'DNI',
    'CE'
  ];

  // Validadores específicos por campo
  const validators = {
    // Validar nombre (general para cualquier campo de nombre)
    validateName: (value: string): string => {
      if (!value.trim()) {
        return 'Este campo es requerido';
      } 
      if (value.length < 3) {
        return 'Debe tener al menos 3 caracteres';
      } 
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        return 'Solo se permiten letras y espacios';
      }
      return '';
    },
    
    // Validar selección
    validateSelection: (value: string): string => {
      return !value.trim() ? 'Debe seleccionar una opción' : '';
    },
    
    // Validar número de documento
    validateDocumentNumber: (value: string): string => {
      if (!value.trim()) {
        return 'El documento es requerido';
      }
      if (!/^\d{8}$/.test(value)) {
        return 'El documento debe tener exactamente 8 dígitos';
      }
      return '';
    },
    
    // Validar valor numérico
    validateNumericValue: (value: string): string => {
      if (!value.trim()) {
        return 'Este campo es requerido';
      }
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return 'Debe ser un número válido mayor a 0';
      }
      return '';
    },
    
    // Validar teléfono
    validatePhone: (value: string): string => {
      if (!value.trim()) {
        return 'El teléfono es requerido';
      } 
      if (!/^[0-9+\-\s()]+$/.test(value)) {
        return 'Formato de teléfono inválido';
      } 
      if (value.replace(/[^0-9]/g, '').length < 9) {
        return 'Debe tener al menos 9 dígitos';
      }
      return '';
    }
  };

  // Función principal de validación
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Aplicamos los validadores específicos para cada campo
    const nameError = validators.validateName(formData.full_name_receptionist);
    if (nameError) newErrors.full_name_receptionist = nameError;
    
    const clientNameError = validators.validateName(formData.full_name_client);
    if (clientNameError) newErrors.full_name_client = clientNameError;
    
    // Solo validamos la selección de sede si hay múltiples sedes
    if (!hasSingleLocation) {
      const sedeError = validators.validateSelection(formData.headquarters_clinica);
      if (sedeError) newErrors.headquarters_clinica = sedeError;
    }
    
    const docTypeError = validators.validateSelection(formData.document_type);
    if (docTypeError) newErrors.document_type = docTypeError;
    
    const docNumberError = validators.validateDocumentNumber(formData.identification_number);
    if (docNumberError) newErrors.identification_number = docNumberError;
    
    const incomeError = validators.validateNumericValue(formData.average_income);
    if (incomeError) newErrors.average_income = incomeError;
    
    const phoneError = validators.validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    return newErrors;
  };

  // Validar un campo individual
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'full_name_receptionist':
      case 'full_name_client':
        return validators.validateName(value);
      case 'headquarters_clinica':
        // No validamos la selección si hay una sola sede (ya está preseleccionada)
        return hasSingleLocation ? '' : validators.validateSelection(value);
      case 'document_type':
        return validators.validateSelection(value);
      case 'identification_number':
        return validators.validateDocumentNumber(value);
      case 'average_income':
        return validators.validateNumericValue(value);
      case 'phone':
        return validators.validatePhone(value);
      default:
        return '';
    }
  };

  // Manejo de cambios en inputs con validación en tiempo real
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar el campo en tiempo real, pero solo después de que el usuario haya interactuado con él
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Manejo de blur para validación cuando el usuario sale de un campo
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario registerPatients enviado, validando...");
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("Errores de validación encontrados:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    console.log("Validación exitosa, enviando datos...");
    setIsLoading(true);
    setErrors({});

    try {
      // Preparar payload con datos del login, formulario y clínica actual
      // Asegurar que la sede esté incluida correctamente en el payload
      const formDataWithSede = {
        ...formData,
        // Siempre incluimos la sede correcta en el payload
        headquarters_clinica: hasSingleLocation 
          ? singleLocation // Cuando hay una sola sede, usamos esa
          : formData.headquarters_clinica // Cuando hay múltiples, usamos la seleccionada
      };
      
      const payload = {
        formData: formDataWithSede,
        timestamp: new Date().toISOString(),
        source: 'register-patients',
        clinicId: clinicId, // Incluimos el parámetro de la URL
        //hasSingleLocation: hasSingleLocation, // Información útil para análisis
        // Si hay una sola sede, la incluimos también a nivel raíz para facilitar procesamiento
        //singleLocation: hasSingleLocation ? singleLocation : undefined
      };

      // Uso de la variable de entorno o URL por defecto
      const endpoint = import.meta.env.VITE_API_ENDPOINT_FORM || 'https://jsonplaceholder.typicode.com/posts';
      console.log("Endpoint utilizado:", endpoint);
      console.log("Sede incluida:", formDataWithSede.headquarters_clinica);
      console.log("Enviando payload:", JSON.stringify(payload, null, 2));
      
      // Envío a endpoint real
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error en el envío de datos');
      }

      let result = await response.json();
      
      // Eliminar el id generado por la API de prueba si existe
      if (result && result.id) {
        delete result.id;
      }
      
      console.log('Datos enviados exitosamente:', result);
      setIsSubmitted(true);
      
      // Opcional: redirigir después del envío exitoso
      //setTimeout(() => {
       // navigate('/success', { state: { submissionId: result.id } });
      //}, 2000);

    } catch (error) {
      console.error('Error al enviar datos:', error);
      setErrors({ general: 'Error al enviar los datos. Por favor, intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };



  // Si estamos validando, mostramos un estado de carga
  if (isValidating) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Si la clínica no es válida, no renderizamos nada porque ya hemos redirigido
  if (!isValidClinic) {
    return null;
  }

  return (
    <>
        <div className={styles.container}>
          <div className={styles.logoContainer}>
            <img 
              src={kiwiTextGreenIcon} 
              alt="Kiwi" 
              className={styles.logo}
            />
          </div>
        
          <div className={styles.formContainer}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.title}>¡Haz realidad tu tratamiento de salud hoy!</h1>
            </header>

            {/* Mensaje de éxito */}
            {isSubmitted && (
              <div className={styles.successMessage} role="alert">
                <div className={styles.successIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2>¡Formulario enviado exitosamente!</h2>
                <p>Pronto nos pondremos en contacto contigo.</p>
              </div>
            )}

        {/* Formulario */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Error general */}
            {errors.general && (
              <div className={styles.errorMessage} role="alert">
                {errors.general}
              </div>
            )}

            {/* Nombres y Apellidos Recepcionista */}
            <div className={styles.inputGroup}>
              <label htmlFor="full_name_receptionist" className={styles.label}>
                Nombres y Apellidos Recepcionista
              </label>
              <input
                type="text"
                id="full_name_receptionist"
                name="full_name_receptionist"
                value={formData.full_name_receptionist}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.full_name_receptionist ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="name"
                placeholder="Ingrese su nombre completo"
              />
              {errors.full_name_receptionist && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.full_name_receptionist}
                </span>
              )}
            </div>

               {/* Sede de la Clínica - Solo visible si hay múltiples sedes */}
            {!hasSingleLocation ? (
              <div className={styles.inputGroup}>
                <label htmlFor="headquarters_clinica" className={styles.label}>
                  Sede <span className={styles.required}>(obligatorio)</span>
                </label>
                <select
                  id="headquarters_clinica"
                  name="headquarters_clinica"
                  value={formData.headquarters_clinica}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`${styles.select} ${errors.headquarters_clinica ? styles.inputError : ''}`}
                  disabled={isLoading}
                  aria-describedby={errors.headquarters_clinica ? "error-headquarters_clinica" : undefined}
                >
                  <option value="">Seleccione una sede</option>
                  {clinicSedes.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.headquarters_clinica && (
                  <span className={styles.inputErrorText} id="error-headquarters_clinica">
                    <i className="bi bi-exclamation-circle iconAlert"></i>
                    {errors.headquarters_clinica}
                  </span>
                )}
              </div>
            ) : (
              // Cuando hay una única sede, incluimos un campo oculto pero no mostramos nada visualmente
              <input 
                type="hidden" 
                id="headquarters_clinica"
                name="headquarters_clinica"
                value={singleLocation}
              />
            )}

            {/* Nombres y Apellidos Cliente */}
            <div className={styles.inputGroup}>
              <label htmlFor="full_name_client" className={styles.label}>
                Nombres y Apellidos Cliente
              </label>
              <input
                type="text"
                id="full_name_client"
                name="full_name_client"
                value={formData.full_name_client}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.full_name_client ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="name"
                placeholder="Ingrese el nombre del cliente"
                aria-describedby={errors.full_name_client ? "error-full_name_client" : undefined}
              />
              {errors.full_name_client && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.full_name_client}
                </span>
              )}
            </div>

            {/* Tipo de Documento */}
            <div className={styles.inputGroup}>
              <label htmlFor="document_type" className={styles.label}>
                Tipo de Documento <span className={styles.required}>(obligatorio)</span>
              </label>
              <select
                id="document_type"
                name="document_type"
                value={formData.document_type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.select} ${errors.document_type ? styles.inputError : ''}`}
                disabled={isLoading}
                aria-describedby={errors.document_type ? "error-document_type" : undefined}
              >
                <option value="">Seleccione tipo de documento</option>
                {tipoDocumentoOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.document_type && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.document_type}
                </span>
              )}
            </div>

            {/* DNI */}
            <div className={styles.inputGroup}>
              <label htmlFor="identification_number" className={styles.label}>
                N° Documento <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="text"
                id="identification_number"
                name="identification_number"
                value={formData.identification_number}
                onChange={handleInputChange}
                onBlur={handleBlur}
                maxLength={8}
                className={`${styles.input} ${errors.identification_number ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
                placeholder="Ingrese número de documento"
                aria-describedby={errors.identification_number ? "error-identification_number" : undefined}
              />
              {errors.identification_number && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.identification_number}
                </span>
              )}
            </div>

            {/* Ingreso Mensual */}
            <div className={styles.inputGroup}>
              <label htmlFor="average_income" className={styles.label}>
                Ingreso Mensual Promedio S/. <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="number"
                id="average_income"
                name="average_income"
                value={formData.average_income}
                onChange={handleInputChange}
                onBlur={handleBlur}
                step="0.01"
                min="1"
                className={`${styles.input} ${errors.average_income ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
                placeholder="Ingrese monto en S/."
                aria-describedby={errors.average_income ? "error-average_income" : undefined}
              />
              {errors.average_income && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.average_income}
                </span>
              )}
            </div>

            {/* Teléfono */}
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Teléfono <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                maxLength={20}
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="tel"
                placeholder="Ej. 987654321"
                aria-describedby={errors.phone ? "error-phone" : undefined}
              />
              {errors.phone && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Botón de envío */}
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingText}>
                    <span className={styles.spinner} aria-hidden="true"></span>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <span>Enviar</span>
                    <span className={styles.buttonIcon}></span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
        {/* Footer */}
       <Footer />
      </div>
    </>
  );
};

export default RegisterPatients;
