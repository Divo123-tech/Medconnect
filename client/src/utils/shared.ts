export const handleGoogleLogin = () => {
  window.location.href = `${
    import.meta.env.VITE_BACKENDURL
  }/oauth2/authorization/google`;
};
