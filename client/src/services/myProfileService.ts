export const getMyProfile = async (token: string | null) => {
  console.log(token);
  const res = await fetch("http://localhost:8080/api/v1/my-profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();
  return data;
};
