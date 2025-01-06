import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token not found. Redirecting to login...");
        router.replace("/login");
        return;
      }

      const fetchRole = async () => {
        try {
          const response = await fetch(
            "https://api-ecatalogue-staging.online/api/check-role",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch role");
          }

          const result = await response.json();
          console.log("Role fetched successfully:", result.data);
          if (
            result.status === "success" &&
            allowedRoles.includes(result.data)
          ) {
            console.log("Access granted for role:", result.data);
          } else {
            console.warn("Access denied. Redirecting...");
            router.replace("/not-authorized");
          }
        } catch (error) {
          console.error("Error while checking role:", error);
          router.replace("/login");
        }
      };

      fetchRole();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
