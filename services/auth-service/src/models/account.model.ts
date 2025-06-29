import mongoose,{Document, Schema} from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enums";

export interface AccountDocument extends Document{
    provider: ProviderEnumType;
    providerId: String;
    userId: mongoose.Types.ObjectId | null;
    refreshToken: string | null;
    tokenExpiry: Date | null;   
    createAt: Date;
}

const accountSchema = new Schema<AccountDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
        default: null
    },
    provider: {
        type:String, 
        enum:Object.values(ProviderEnum),
        required:true
    },
    providerId: {
        type:String, 
        required:true,
        unique:true
    },
    refreshToken: {type:String, default: null},
    tokenExpiry: {type:Date, default: null},
    createAt: {type:Date, default: Date.now},
},
{
    timestamps:{
        createdAt:'createAt'
    },
    toJSON: {
        transform(doc, ret) {
            delete ret.refreshToken;
        }
    }
});

const accountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default accountModel;