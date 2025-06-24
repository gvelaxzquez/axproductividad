import { Button, Checkbox, Form, Input, message, Typography } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";

const { Title, Text, Link } = Typography;

const Login = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Estado para alternar entre formularios
  const [isLoading, setIsLoading] = useState(false); // Estado para bloquear el botón mientras se ejecuta la petición

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // Estado para controlar el checkbox de recordar credenciales

  const currentYear = new Date().getFullYear();
  const [login] = Form.useForm();

  const [, setLoading] = useState(false);

  useEffect(() => {
    // Cargar credenciales desde localStorage si existen
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    // const savedRemember = localStorage.getItem("remember") === "true";

    setRemember(true);

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const onRememberChange = (e) => {
    setRemember(e.target.checked);
  };

  const onFinish = async (e) => {
    e.preventDefault();

    setLoading(true);
    setIsLoading(true);

    const values = {
      Usuario: email,
      Contrasena: password,
    };

    // Simula una petici�n al backend
    const response = await fetch("/Login/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      if (data.Exito) {
        if (remember) {
          // Guardar credenciales si "Recordar credenciales" está marcado
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          localStorage.setItem("remember", "true");
        } else {
          // Eliminar credenciales si no está marcado
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.setItem("remember", "false");
        }

        window.location.href = data.URL;
      } else {
        setIsLoading(false);
        message.error(data.Mensaje);
      }
    } else {
      setIsLoading(false);
      const error = await response.json();
      console.log(error)
      message.error("Error al ejecutar la petición");
      /*   message.error(error.message || 'Error en el inicio de sesi�n');*/
    }
  };

  const onFinishForgotPassword = async (values) => {
    setIsLoading(true);
    setLoading(true);

    // Simula una petici�n al backend
    const response = await fetch("/Login/RecuperarContrasena", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      if (data.Exito) {
        message.success(
          "Se ha enviado un correo para recuperar tu contraseña a " +
          values.Usuario
        );
        setIsForgotPassword(false); // Regresa al formulario de inicio de sesión
        setIsLoading(false);
      } else {
        setIsLoading(false);
        message.error(data.Mensaje);
      }
    } else {
      setIsLoading(false);
      message.error("Error al ejecutar la petición");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <img
        src="../../../Content/Project/Imagenes/LogoPrincipal.png"
        alt="yitpro logo"
        style={{ width: 189, height: 69, marginBottom: 20 }}
      />{" "}
      {/* Reemplaza 'logo.png' con la ruta correcta de tu logo */}
      <div
        style={{
          width: 300,
          padding: 20,
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={4} style={{ textAlign: "center", marginBottom: 20 }}>
          {" "}
          {isForgotPassword
            ? "Recuperar contraseña"
            : "Inicia sesión con tu cuenta"}
        </Title>

        {!isForgotPassword ? (
          <Form
            form={login}
            name="login"
            initialValues={{ remember: true }}
            onSubmitCapture={onFinish}
            layout="vertical"
          >
            <Form.Item
              /* name="Usuario"*/

              rules={[
                {
                  required: true,
                  message: "Por favor, ingresa tu correo electrónico",
                },
                {
                  type: "email",
                  message: "Por favor, ingresa un correo electrónico válido",
                },
              ]}
            >
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
              />
            </Form.Item>

            <Form.Item
              /*   name="Contrasena"*/
              rules={[
                { required: true, message: "Por favor, ingresa tu contraseña" },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
            </Form.Item>

            <Form.Item
              /*name="remember" */ valuePropName="checked"
              style={{ marginBottom: 10 }}
            >
              <Checkbox checked={remember} onChange={onRememberChange}>
                Recordar credenciales
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                style={{ backgroundColor: "#0057FF", borderColor: "#0057FF" }}
              >
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            name="forgotPassword"
            layout="vertical"
            onFinish={onFinishForgotPassword}
          >
            <Form.Item
              name="Usuario"
              rules={[
                {
                  required: true,
                  message: "Por favor, ingresa tu correo electrónico",
                },
                {
                  type: "email",
                  message: "Por favor, ingresa un correo electrónico válido",
                },
              ]}
            >
              <Input placeholder="Ingresa tu correo electrónico" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Enviar correo de recuperación
              </Button>
            </Form.Item>
          </Form>
        )}
        {!isForgotPassword ? (
          <Link
            href="#"
            onClick={() => setIsForgotPassword(true)}
            style={{ display: "block", textAlign: "center", marginTop: 10 }}
          >
            ¿Olvidó su contraseña?
          </Link>
        ) : (
          <Link
            href="#"
            onClick={() => setIsForgotPassword(false)}
            style={{ display: "block", textAlign: "center", marginTop: 10 }}
          >
            Volver al inicio de sesión
          </Link>
        )}
      </div>
      <Text style={{ marginTop: 20, color: "#aaa" }}>
        ©{currentYear} - Axsis tecnología
      </Text>
    </div>
  );
};

export default Login;

// import React, { useState, useEffect  } from 'react';
// import { Form, Input, Button, Checkbox, Typography, Switch } from 'antd';
// import 'antd/dist/reset.css';
// import './theme-light.less'; // Carga el tema claro por defecto

// const { Title, Text, Link } = Typography;

// const Login = () => {
//   const [isForgotPassword, setIsForgotPassword] = useState(false); // Estado para alternar entre formularios
//   const [isLoading, setIsLoading] = useState(false); // Estado para bloquear el botón mientras se ejecuta la petición

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [remember, setRemember] = useState(false); // Estado para controlar el checkbox de recordar credenciales
//   const currentYear = new Date().getFullYear();
//   const [login] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false); // Controla el modo claro/oscuro

//   useEffect(() => {
//       // Cargar credenciales desde localStorage si existen
//       const savedEmail = localStorage.getItem('email');
//       const savedPassword = localStorage.getItem('password');
//       const savedRemember = localStorage.getItem('remember') === 'true';

//       setRemember(true);

//       if (savedEmail && savedPassword) {
//           setEmail(savedEmail);
//           setPassword(savedPassword);
//           setRemember(true);
//         }
//     }, []);

// const onRememberChange = (e) => {
//       setRemember(e.target.checked);
//     };

//   const onFinish = async (e) => {

//       e.preventDefault();

//       setLoading(true);
//       setIsLoading(true);

//       const values = {

//           Usuario :email,
//           Contrasena: password
//       }

//       // Simula una petici�n al backend
//       const response = await fetch('/Login/Login', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(values),
//       });

//       setLoading(false);

//       if (response.ok) {

//           const data = await response.json();
//           if (data.Exito) {

//               if (remember) {
//                   // Guardar credenciales si "Recordar credenciales" está marcado
//                   localStorage.setItem('email', email);
//                   localStorage.setItem('password', password);
//                   localStorage.setItem('remember', true);
//                 } else {
//                   // Eliminar credenciales si no está marcado
//                   localStorage.removeItem('email');
//                   localStorage.removeItem('password');
//                   localStorage.setItem('remember', false);
//                 }

//               window.location.href = data.URL;
//           }
//           else {
//               setIsLoading(false);
//               message.error(data.Mensaje);
//           }

//       } else {
//           setIsLoading(false);
//           const error = await response.json();
//           message.error('Error al ejecutar la petición');
//        /*   message.error(error.message || 'Error en el inicio de sesi�n');*/
//       }
//   };

//   const onFinishForgotPassword = async (values) => {

//       setIsLoading(true);
//       setLoading(true);

//       // Simula una petici�n al backend
//       const response = await fetch('/Login/RecuperarContrasena', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(values),
//       });

//       setLoading(false);

//       if (response.ok) {

//           const data = await response.json();
//           if (data.Exito) {

//               message.success('Se ha enviado un correo para recuperar tu contraseña a ' + values.Usuario );
//               setIsForgotPassword(false); // Regresa al formulario de inicio de sesión
//               setIsLoading(false);
//           }
//           else {
//               setIsLoading(false);
//               message.error(data.Mensaje);
//           }

//       } else {
//           setIsLoading(false);
//           message.error('Error al ejecutar la petición');

//       }

//     }

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme'); // Obtenemos el tema guardado (si existe)
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === 'dark');

//     } else {
//       // Si no hay preferencia guardada, detectamos el tema basado en el sistema
//       const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//       setIsDarkMode(prefersDark);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode ? 'dark' : 'light';
//     setIsDarkMode(!isDarkMode);
//     // Guardamos la preferencia en localStorage
//     localStorage.setItem('theme', newTheme);

//     // Cambiar la clase del body (o cualquier otro método que utilices para aplicar los estilos)
//     document.body.classList.toggle('dark-mode', newTheme === 'dark');
//     // const newTheme = !isDarkMode ? 'dark' : 'light';
//     // setIsDarkMode(!isDarkMode);
//     // if (isDarkMode) {
//     //   import('./theme-light.less'); // Cambia al tema claro
//     // } else {
//     //   import('./theme-dark.less'); // Cambia al tema oscuro
//     // }
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         backgroundColor: isDarkMode ? '#141414' : '#f0f2f5',
//       }}
//     >
//       <div style={{ position: 'absolute', top: 10, right: 10 }}>
//         <Switch
//           checked={isDarkMode}
//           onChange={toggleTheme}
//           checkedChildren="Oscuro"
//           unCheckedChildren="Claro"
//         />
//       </div>
//       <img
//         src="../Content/Project/Imagenes/LogoPrincipal.png"
//         alt="Logo"
//         style={{ width: 189, height: 69, marginBottom: 20 }}
//       />
//       <div
//         style={{
//           width: 300,
//           padding: 20,
//           backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
//           borderRadius: 8,
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//         }}
//       >
//         <Title level={4} style={{ textAlign: 'center', marginBottom: 20, color: isDarkMode ? '#fff' : '#000' }}>
//           Inicia sesión con tu cuenta
//         </Title>
//         <Form layout="vertical">
//           <Form.Item name="email"
//                rules={[{ required: true, message: 'Por favor, ingresa tu correo electrónico' }]}

//                >
//             <Input placeholder="Correo electrónico"   style={{ color: isDarkMode ? '#fff' : '#000', background: isDarkMode ? '#000' : '#fff', borderColor:isDarkMode ? '#000' : '#fff'  }}/>
//           </Form.Item>
//           <Form.Item name="password" rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}>
//             <Input.Password placeholder="Contraseña"  style={{ color: isDarkMode ? '#fff' : '#000', background: isDarkMode ? '#000' : '#fff', borderColor:isDarkMode ? '#000' : '#fff'  }}/>
//           </Form.Item>
//           <Form.Item valuePropName="checked">
//             <Checkbox style={{ color: isDarkMode ? '#fff' : '#000' }}>Recordar credenciales</Checkbox>
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" block>
//               Ingresar
//             </Button>
//           </Form.Item>
//         </Form>
//         <Link style={{ color: isDarkMode ? '#1890ff' : '#0057FF', textAlign: 'center', display: 'block' }}>
//           ¿Olvidó su contraseña?
//         </Link>
//       </div>
//       <Text style={{ marginTop: 20, color: isDarkMode ? '#aaa' : '#000' }}>©{currentYear} - Axsis Tecnología</Text>
//     </div>
//   );
// };

// export default Login;
