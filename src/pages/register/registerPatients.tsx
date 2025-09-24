import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import styles from './registerPatients.module.css';
import kiwiTextGreenIcon from '../../assets/kiwiTextGreenLightIcon.svg';
import { ALLOWED_CLINICS } from '../../constants/constants.clinicas';
import Footer from '../components/footer';

// Componente para mostrar cuando la clínica no se encuentra en la lista de permitidas
const NotFoundComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={kiwiTextGreenIcon} alt="Kiwi Logo" className={styles.logo} />
      </div>
      <div className={styles.notFoundContent}>
        <h1 className={styles.notFoundTitle}>Página no encontrada</h1>
        <p className={styles.notFoundText}>
          No pudimos encontrar la página que buscabas. Esto puede ser porque:
        </p>
        <ul className={styles.notFoundList}>
          <li>Hay un error en la URL que escribiste en el navegador web. Comprueba la URL e inténtalo de nuevo.</li>
          <li>La página que estás buscando cambió de ubicación o fue eliminada.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

interface FormData {
  nombresApellidosRecepcionista: string;
  nombresApellidosCliente: string;
  clinica: string;
  //especialidadMedica: string;
  tipoDocumento: string;
  dni: string;
  ingresoMensualPromedio: string;
  costoAproximadoTratamiento: string;
  //codigoAprovTratamiento: string;
  telefono: string;
  //correoElectronico: string;
}

interface FormErrors {
  [key: string]: string;
}


const RegisterPatients: React.FC = () => {
  // const navigate = useNavigate(); // Commented out as we're no longer redirecting
  const { clinicId } = useParams<{ clinicId: string }>();
  const [isValidClinic, setIsValidClinic] = useState<boolean>(true);

  // Validar que la clínica exista en nuestras constantes permitidas
  useEffect(() => {
    if (!clinicId || !Object.values(ALLOWED_CLINICS).includes(clinicId as any)) {
      // En lugar de redireccionar, mostraremos el componente NotFoundComponent
      setIsValidClinic(false);
    } else {
      setIsValidClinic(true);
    }
  }, [clinicId]);

  const [formData, setFormData] = useState<FormData>({
    nombresApellidosRecepcionista: '',
    nombresApellidosCliente: '',
    clinica: '',
    //especialidadMedica: '',
    tipoDocumento: '',
    dni: '',
    ingresoMensualPromedio: '',
    costoAproximadoTratamiento: '',
    //codigoAprovTratamiento: '',
    telefono: '',
    //correoElectronico: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Opciones para selects
 const clinicasOptions = [
    'SJL',
    'Miraflores',
    'San Isidro',
  ];

  /*
  const especialidadesOptions = [
    'Cardiología',
    'Dermatología',
    'Endocrinología',
    'Gastroenterología',
    'Ginecología',
    'Neurología',
    'Oftalmología',
    'Oncología',
    'Pediatría',
    'Psiquiatría',
    'Traumatología',
    'Urología',
    'Otro'
  ]; */

   const tipoDocumentoOptions = [
    'DNI',
    'CE'
  ];

  // Validaciones
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validación Nombres y Apellidos Recepcionista
    if (!formData.nombresApellidosRecepcionista.trim()) {
      newErrors.nombresApellidosRecepcionista = 'Este campo es requerido';
    } else if (formData.nombresApellidosRecepcionista.length < 3) {
      newErrors.nombresApellidosRecepcionista = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nombresApellidosRecepcionista)) {
      newErrors.nombresApellidosRecepcionista = 'Solo se permiten letras y espacios';
    }

    // Validación Nombres y Apellidos Cliente
    if (!formData.nombresApellidosCliente.trim()) {
      newErrors.nombresApellidosCliente = 'Este campo es requerido';
    } else if (formData.nombresApellidosCliente.length < 3) {
      newErrors.nombresApellidosCliente = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nombresApellidosCliente)) {
      newErrors.nombresApellidosCliente = 'Solo se permiten letras y espacios';
    }

    // Validación Clínica
    if (!formData.clinica.trim()) {
      newErrors.clinica = 'Debe seleccionar una clínica';
    }

    // Esta validación se omite ya que el campo está comentado en la UI
    // if (!formData.especialidadMedica.trim()) {
    //   newErrors.especialidadMedica = 'Debe seleccionar una especialidad';
    // }

     // Validación Tipo de Documento
    if (!formData.tipoDocumento.trim()) {
      newErrors.tipoDocumento = 'Debe seleccionar un tipo de documento';
    }

    // Validación DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }

    // Validación Ingreso Mensual
    if (!formData.ingresoMensualPromedio.trim()) {
      newErrors.ingresoMensualPromedio = 'Este campo es requerido';
    } else if (isNaN(Number(formData.ingresoMensualPromedio)) || Number(formData.ingresoMensualPromedio) <= 0) {
      newErrors.ingresoMensualPromedio = 'Debe ser un número válido mayor a 0';
    }

     // Validación Costo Aproximado Tratamiento
    if (!formData.costoAproximadoTratamiento.trim()) {
      newErrors.costoAproximadoTratamiento = 'Este campo es requerido';
    } else if (isNaN(Number(formData.costoAproximadoTratamiento)) || Number(formData.costoAproximadoTratamiento) <= 0) {
      newErrors.costoAproximadoTratamiento = 'Debe ser un número válido mayor a 0';
    }

    // Esta validación se omite ya que el campo está comentado en la UI
    // if (!formData.codigoAprovTratamiento.trim()) {
    //   newErrors.codigoAprovTratamiento = 'Este campo es requerido';
    // } else if (formData.codigoAprovTratamiento.length < 3) {
    //   newErrors.codigoAprovTratamiento = 'Debe tener al menos 3 caracteres';
    // }

    // Validación Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    } else if (formData.telefono.replace(/[^0-9]/g, '').length < 9) {
      newErrors.telefono = 'Debe tener al menos 9 dígitos';
    }

    // Validación Correo Electrónico (Opcional)
    /*if (formData.correoElectronico.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
      newErrors.correoElectronico = 'Formato de correo electrónico inválido';
    }*/

    return newErrors;
  };

  // Manejo de cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      const payload = {
        formData: formData,
        timestamp: new Date().toISOString(),
        source: 'register-patients',
        clinicId: clinicId // Incluimos el parámetro de la URL
      };

      // Uso de la variable de entorno o URL por defecto
      const endpoint = import.meta.env.VITE_API_ENDPOINT_FORM || 'https://jsonplaceholder.typicode.com/posts';
      console.log("Endpoint utilizado:", endpoint);
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

  // Función para limpiar formulario
  /*const handleReset = () => {
    setFormData({
      nombresApellidosRecepcionista: '',
      nombresApellidosCliente: '',
      clinica: '',
      especialidadMedica: '',
      dni: '',
      ingresoMensualPromedio: '',
      codigoAprovTratamiento: '',
      telefono: '',
      correoElectronico: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };*/

  return (
    <>
      {!isValidClinic ? (
        <NotFoundComponent />
      ) : (
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
              <div className={styles.successMessage}>
                <h2>¡Formulario enviado exitosamente!</h2>
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
              <label htmlFor="nombresApellidosRecepcionista" className={styles.label}>
                Nombres y Apellidos Recepcionista
              </label>
              <input
                type="text"
                id="nombresApellidosRecepcionista"
                name="nombresApellidosRecepcionista"
                value={formData.nombresApellidosRecepcionista}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.nombresApellidosRecepcionista ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.nombresApellidosRecepcionista && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.nombresApellidosRecepcionista}
                </span>
              )}
            </div>

               {/* Clínica */}
            <div className={styles.inputGroup}>
              <label htmlFor="clinica" className={styles.label}>
                Sede <span className={styles.required}>(obligatorio)</span>
              </label>
              <select
                id="clinica"
                name="clinica"
                value={formData.clinica}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.clinica ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                <option value="">Seleccione una opción</option>
                {clinicasOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.clinica && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.clinica}
                </span>
              )}
            </div>

            {/* Nombres y Apellidos Cliente */}
            <div className={styles.inputGroup}>
              <label htmlFor="nombresApellidosCliente" className={styles.label}>
                Nombres y Apellidos Cliente
              </label>
              <input
                type="text"
                id="nombresApellidosCliente"
                name="nombresApellidosCliente"
                value={formData.nombresApellidosCliente}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.nombresApellidosCliente ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="name"
              />
              {errors.nombresApellidosCliente && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.nombresApellidosCliente}
                </span>
              )}
            </div>

            {/* Especialidad Médica 
            <div className={styles.inputGroup}>
              <label htmlFor="especialidadMedica" className={styles.label}>
                Especialidad Médica de Interés <span className={styles.required}>(obligatorio)</span>
              </label>
              <select
                id="especialidadMedica"
                name="especialidadMedica"
                value={formData.especialidadMedica}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.especialidadMedica ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                <option value="">Elige categoría especialidades</option>
                {especialidadesOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.especialidadMedica && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.especialidadMedica}
                </span>
              )}
            </div>  */}

               {/* Tipo de Documento */}
            <div className={styles.inputGroup}>
              <label htmlFor="tipoDocumento" className={styles.label}>
                Tipo de Documento <span className={styles.required}>(obligatorio)</span>
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.tipoDocumento ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                <option value="">Seleccione una opción</option>
                {tipoDocumentoOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.tipoDocumento && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.tipoDocumento}
                </span>
              )}
            </div>

            {/* DNI */}
            <div className={styles.inputGroup}>
              <label htmlFor="dni" className={styles.label}>
                N° DNI <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                maxLength={8}
                className={`${styles.input} ${errors.dni ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.dni && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.dni}
                </span>
              )}
            </div>

            {/* Ingreso Mensual */}
            <div className={styles.inputGroup}>
              <label htmlFor="ingresoMensualPromedio" className={styles.label}>
                Ingreso Mensual Promedio S/. <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="number"
                id="ingresoMensualPromedio"
                name="ingresoMensualPromedio"
                value={formData.ingresoMensualPromedio}
                onChange={handleInputChange}
                step="0.01"
                className={`${styles.input} ${errors.ingresoMensualPromedio ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.ingresoMensualPromedio && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.ingresoMensualPromedio}
                </span>
              )}
            </div>

             {/* costo aproximado de  tratamiento */}
            <div className={styles.inputGroup}>
              <label htmlFor="costoAproximadoTratamiento" className={styles.label}>
                Costo Apróx. Tratamiento S/. <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="number"
                id="costoAproximadoTratamiento"
                name="costoAproximadoTratamiento"
                value={formData.costoAproximadoTratamiento}
                onChange={handleInputChange}
                step="0.01"
                className={`${styles.input} ${errors.costoAproximadoTratamiento ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.costoAproximadoTratamiento && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.costoAproximadoTratamiento}
                </span>
              )}
            </div>

            {/* Código Tratamiento 
            <div className={styles.inputGroup}>
              <label htmlFor="codigoAprovTratamiento" className={styles.label}>
                Código Aprob. Tratamiento S/. <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="text"
                id="codigoAprovTratamiento"
                name="codigoAprovTratamiento"
                value={formData.codigoAprovTratamiento}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.codigoAprovTratamiento ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="off"
              />
              {errors.codigoAprovTratamiento && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.codigoAprovTratamiento}
                </span>
              )}
            </div>  */}

            {/* Teléfono */}
            <div className={styles.inputGroup}>
              <label htmlFor="telefono" className={styles.label}>
                Teléfono <span className={styles.required}>(obligatorio)</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                maxLength={20}
                value={formData.telefono}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="tel"
              />
              {errors.telefono && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.telefono}
                </span>
              )}
            </div>

            {/* Correo Electrónico 
            <div className={styles.inputGroup}>
              <label htmlFor="correoElectronico" className={styles.label}>
                Correo electrónico <span className={styles.optional}>(Opcional)</span>
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.correoElectronico ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.correoElectronico && (
                <span className={styles.inputErrorText}>
                  <i className="bi bi-exclamation-circle iconAlert"></i>
                  {errors.correoElectronico}
                </span>
              )}
            </div>  */}

            {/* Botones */}
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingText}>
                    <span className={styles.spinner}></span>
                    Enviando...
                  </span>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </form>
        )}

      </div>
        {/* Footer */}
       <Footer />
      </div>
    )}
    </>
  );
};

export default RegisterPatients;
