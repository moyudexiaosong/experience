import loginStore from "./modules/loginModule";
import { defineStore } from "pinia";
const useStore = defineStore("store", () => {
  return {
    loginStore: loginStore(),
  };
});

export default useStore;
