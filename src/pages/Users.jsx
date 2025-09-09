import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleLogo from '../assets/GoogleLogo.png';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export default function Users() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const { isMobile } = useDeviceDetection();

  const auth = getAuth();

  // Check if already logged in
  auth.onAuthStateChanged((u) => {
    if (u && !user) setUser(u);
    if (!u && user) setUser(null);
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  // Estilos condicionales para mobile
  const containerClass = isMobile
    ? "max-w-sm mx-auto mt-8 bg-white rounded-3xl shadow-lg p-6"
    : "max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8";

  const titleClass = isMobile
    ? "text-xl font-bold font-baloo text-[#FF6B35] mb-4 text-center"
    : "text-2xl font-bold font-baloo text-[#FF6B35] mb-6 text-center";

  const inputClass = isMobile
    ? "border rounded-xl px-4 py-4 font-baloo text-lg mb-3"
    : "border rounded-lg px-4 py-3 font-baloo text-base";

  const buttonClass = isMobile
    ? "bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-white font-bold py-4 rounded-xl font-baloo text-lg mt-2"
    : "bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-white font-bold py-3 rounded-xl font-baloo text-lg mt-2";

  const googleBtnStyle = isMobile
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        background: '#fff',
        border: '1px solid #dadce0',
        borderRadius: '12px',
        padding: '14px 0',
        fontWeight: 500,
        fontSize: '18px',
        color: '#3c4043',
        gap: '12px',
        marginTop: '20px',
        cursor: 'pointer'
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        background: '#fff',
        border: '1px solid #dadce0',
        borderRadius: '6px',
        padding: '10px 0',
        fontWeight: 500,
        fontSize: '16px',
        color: '#3c4043',
        gap: '12px',
        marginTop: '18px',
        cursor: 'pointer'
      };

  const toggleBtnClass = isMobile
    ? "text-[#FF6B35] font-baloo font-bold text-lg hover:underline mt-4"
    : "text-[#FF6B35] font-baloo font-bold text-base hover:underline mt-2";

  if (user) {
    return (
      <div className={containerClass}>
        <h2 className={titleClass}>¡Hola, {user.displayName || user.email}!</h2>
        <p className={isMobile ? "mb-4 text-center" : "mb-6 text-center"}>Ya estás logueado.</p>
        <button
          onClick={handleLogout}
          className={buttonClass}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h2 className={titleClass}>
        {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
        {error && <div className="text-red-500 font-bold text-center">{error}</div>}
        <button
          type="submit"
          className={buttonClass}
        >
          {isLogin ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </form>
      <div className="flex flex-col items-center gap-2 mt-6">
        <button
          onClick={handleGoogle}
          style={googleBtnStyle}
        >
          <img
            src={GoogleLogo}
            alt="Google"
            style={{ width: isMobile ? 26 : 22, height: isMobile ? 26 : 22, marginRight: 8 }}
          />
          <span>Continuar con Google</span>
        </button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className={toggleBtnClass}
        >
          {isLogin ? '¿No tenés cuenta? Crear una' : '¿Ya tenés cuenta? Ingresar'}
        </button>
      </div>
    </div>
  );
}