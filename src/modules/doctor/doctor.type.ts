
export interface DoctorProfileData {

    name: string,
    userId: string,
    email: string,
    password: string,

    profilePicture?: string,
    contactNumber?: string,
    address?: string,
    registerNumber?: string,
    age?: number,
    appointmentFee?: number,
    qualification?: string,
    workingHospital?: string,
    designation?: string,
    isNeedPasswordChanged?: boolean,

    specializations: string[]
}


export interface Specialty {
    id: string,
    title: string,
    icon: string,
    
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null

}