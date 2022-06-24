import { UPDATE_MODEL, UPDATE_MENU } from "./constants.js";

const updateModel = (data) => ({ type: UPDATE_MODEL, data });
const updateMenu = (data) => ({ type: UPDATE_MENU, data });

export { updateModel, updateMenu };
