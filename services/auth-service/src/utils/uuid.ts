import { v4 as uuid} from "uuid";

export const generateInviteCode = () => {
    return uuid().replace(/-/g,"").substring(0,8);
}