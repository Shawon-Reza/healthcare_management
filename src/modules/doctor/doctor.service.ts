import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { DoctorProfileData } from "./doctor.type"



const createDoctorProfile = async (doctorProfileData: DoctorProfileData) => {

    // ----------- Check if the user with the given email already exists -----------
    const userExistance = await prisma.user.findUnique({
        where: {
            email: doctorProfileData.email
        }
    });
    if (userExistance) {
        throw new Error("User with this email already exists.");
    }
    //  --------------- Check if the specialization IDs exist in the doctorSpecialty table ----------------
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specialty = [] as any[];

    if (!doctorProfileData.specializations || doctorProfileData.specializations.length === 0) {
        throw new Error("Specializations are required.");
    }
    for (const specializationId of doctorProfileData.specializations || []) {
        const specialization = await prisma.specialty.findUnique({
            where: {
                id: specializationId
            }
        });
        if (!specialization) {
            throw new Error(`Specialization with id ${specializationId} not found.`);
        }
        specialty.push(specialization)
    }




    // ------------- First Create User  --------------
    const user = await auth.api.signUpEmail({
        body: {
            name: doctorProfileData.name,
            email: doctorProfileData.email,
            password: doctorProfileData.password
        },
    });


    // --------------------- transactions for create doctor profile ----------------
    try {
        const doctor = await prisma.$transaction(async (tx) => {

            try {
                const doctorProfile = await tx.doctorProfile.create({
                    data: {
                        userId: user.user.id,
                        name: doctorProfileData.name,
                        email: doctorProfileData.email,
                        profilePicture: doctorProfileData.profilePicture,
                        contactNumber: doctorProfileData.contactNumber,
                        address: doctorProfileData.address,
                        registerNumber: doctorProfileData.registerNumber,
                        age: doctorProfileData.age,
                        appointmentFee: doctorProfileData.appointmentFee,
                        qualification: doctorProfileData.qualification,
                        workingHospital: doctorProfileData.workingHospital,
                        designation: doctorProfileData.designation,
                        isNeedPasswordChanged: doctorProfileData.isNeedPasswordChanged,

                    }

                });

                const doctorSpecialty = specialty.map(specialization => ({

                    specialtyId: specialization.id,
                    doctorId: doctorProfile.id
                }));


                // --------------------- Create doctorSpecialty entries ----------------
                const createdDoctorSpecialties = await tx.doctorSpecialty.createMany({
                    data: doctorSpecialty,
                    skipDuplicates: true
                });

                return { doctorProfile, createdDoctorSpecialties };

            } catch (error) {
                console.error("Error creating doctor profile:", error);
                throw error;
            }

        });
        return {
            ...user,
            doctor
        };
    } catch (error) {
        await prisma.user.delete({
            where: { id: user.user.id }
        })
        throw error;
    }


}



const getDoctorAllDetails = async (doctorId: string) => {
    console.log("DoctorId", doctorId)



    const doctorDetails = await prisma.doctorProfile.findUnique({
        where: {
            id: doctorId
        },
        include: {
            user: true,
            doctorSpecialization: {
                select: {
                    specialty: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            }

        }
    })
    return doctorDetails;
}


export const doctorServices = {
    createDoctorProfile,
    getDoctorAllDetails
}