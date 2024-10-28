import { useEffect } from "react";
import toast from "react-hot-toast";

export const useDisplayError = (error: Error | null, message: string) => {
  useEffect(() => {
    if (error) toast.error(message);
  }, [error, message]);
};
