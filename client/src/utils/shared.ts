export const handleGoogleLogin = () => {
  window.location.href = `${
    import.meta.env.VITE_BACKEND_URL
  }/oauth2/authorization/google`;
};
