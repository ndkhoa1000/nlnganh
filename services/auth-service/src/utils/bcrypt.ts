import bcrypt from 'bcrypt';

export const hashValue = async (value:string, saltRounds: number = 10) => {
    const hash = await bcrypt.hash(value, saltRounds);
    return hash;
}

export const compareValue = async (value:string, hashValue:string) => {
    return await bcrypt.compare(value, hashValue);
}
