import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import circleKiwiIcon from '../../assets/circleKiwiIcon.svg';
import kiwiTextIcon from '../../assets/kiwiTextIcon.svg';

interface FormData {
  usuario: string;
  contraseña: string;
}

interface FormErrors {
  usuario?: string;
  contraseña?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    usuario: '',
    contraseña: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validaciones
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validación de usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.usuario)) {
      newErrors.usuario = 'Solo se permiten letras, números, puntos, guiones y guiones bajos';
    }

    // Validación de contraseña
    if (!formData.contraseña.trim()) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contraseña)) {
      newErrors.contraseña = 'Debe contener mayúscula, minúscula y número';
    }

    return newErrors;
  };

  // Manejo del input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulación de login (aquí iría la lógica real de autenticación)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de validación de credenciales
      if (formData.usuario === 'virtualdent' && formData.contraseña === 'Admin123') {
        // Guardar datos de login en localStorage (en un entorno real, nunca guardar contraseñas en texto plano)
        localStorage.setItem('loginData', JSON.stringify({
          usuario: formData.usuario,
          timestamp: new Date().toISOString()
        }));
        
        // Login exitoso - redirigir a landing de clínicas con los datos
        navigate('/landing-clinicas', { 
          state: { 
            loginData: { 
              usuario: formData.usuario,
              contraseña: formData.contraseña 
            } 
          } 
        });
      } else {
        setErrors({ general: 'Usuario o contraseña incorrectos' });
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle para mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Header con logos */}
        <div className={styles.logoContainer}>
          <img 
            src={circleKiwiIcon} 
            alt="Kiwi Icon" 
            className={styles.circleIcon}
          />
        </div>
        
        <div className={styles.textLogoContainer}>
          <img 
            src={kiwiTextIcon} 
            alt="Kiwi" 
            className={styles.textLogo}
          />
        </div>

        <h2 className={styles.subtitle}>Accede a tu cuenta KiwiPay</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Error general */}
          {errors.general && (
            <div className={styles.errorMessage} role="alert">
              {errors.general}
            </div>
          )}

          {/* Campo Usuario */}
          <div className={styles.inputGroup}>
            <label htmlFor="usuario" className={styles.label}>
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              placeholder="Ingresa tu usuario"
              className={`${styles.input} ${errors.usuario ? styles.inputError : ''}`}
              disabled={isLoading}
              autoComplete="username"
              aria-describedby={errors.usuario ? "usuario-error" : undefined}
            />
            {errors.usuario && (
              <span id="usuario-error" className={styles.inputErrorText} role="alert">
                {errors.usuario}
              </span>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className={styles.inputGroup}>
            <label htmlFor="contraseña" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                className={`${styles.input} ${styles.passwordInput} ${errors.contraseña ? styles.inputError : ''}`}
                disabled={isLoading}
                autoComplete="current-password"
                aria-describedby={errors.contraseña ? "contraseña-error" : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.contraseña && (
              <span id="contraseña-error" className={styles.inputErrorText} role="alert">
                {errors.contraseña}
              </span>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
            aria-label={isLoading ? "Iniciando sesión..." : "Acceder ahora"}
          >
            {isLoading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Iniciando sesión...
              </span>
            ) : (
              "Acceder ahora"
            )}
          </button>
        </form>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className={styles.copyright}>
            Copyright © 2024 KiwiPay. Todos los derechos reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
