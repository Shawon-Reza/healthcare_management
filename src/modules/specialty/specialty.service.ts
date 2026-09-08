import { Prisma, Specialty } from "../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";




const createSpecialty = async (specialtyData: Prisma.SpecialtyCreateInput): Promise<Specialty> => {
    try {
        // const { title } = specialtyData;
        const result = await prisma.specialty.create({
            data: specialtyData,
        });
        return result;
    } catch (error) {
        throw new Error("Failed to create specialty, please try again.", {
            cause: error,
        });
    }

}



const allSpecialty = async (): Promise<Specialty[]> => {
    try {
        const specialties = await prisma.specialty.findMany();
        return specialties;
    } catch (error) {
        throw new Error("Failed to fetch specialties, please try again.", {
            cause: error,
        });
    }
}


const deleteSpecialty = async (specialtyId: string, specialtyTitle: string) => {
    try {
        console.log("Deleting specialty with ID:", specialtyId, "and title:", specialtyTitle);


        let where: Prisma.SpecialtyWhereUniqueInput=specialtyId ? { id: specialtyId } : { title: specialtyTitle }; 

        if(specialtyId){
            where={id:specialtyId}
        }
        if( !specialtyId && specialtyTitle){
            where={title:specialtyTitle}
        }

        const result = await prisma.specialty.delete({
            where 
        })
        return result;


    } catch (error) {
        console.log("Error deleting specialty:", error);
        throw new Error("Failed to delete specialty, please try again.", {
            cause: error,
        });
    }
}





export const specialtyService = {
    createSpecialty,
    allSpecialty,
    deleteSpecialty
};