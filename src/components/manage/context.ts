import { createContext } from "react";

export const ManageContext = createContext<{name : string, email : string} | undefined>({name : "", email : ""});