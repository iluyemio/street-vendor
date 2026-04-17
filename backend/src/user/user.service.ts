import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto, UpdateUserDto, CreateAdminDto } from './dto';
import { prisma } from 'src/lib/prisma';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
    constructor(private jwt:JwtService){}

    private getDatabaseErrorMessage(error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target;
                return `A record with this ${target || 'value'} already exists.`;
            }
            if (error.code === 'P2025') {
                return 'The requested record was not found.';
            }
        }
        return 'An unexpected  error occurred.';
        // return 'An unexpected database error occurred.';
    }

    async createUser(data:UserDto){
        try {
         const existEmail = await prisma.user.findUnique({
            where:{
                email:data.email
            }, 
         });

         if (existEmail) {
            throw new BadRequestException("Email already exists")
         }

         const existOrg = await prisma.user.findUnique({
            where:{
                organization_name:data.organization_name
            },
         });

         if (existOrg) {
            throw new BadRequestException("Organization name already exists")
         }

         if (data.vendor_id) {
            const existVendor = await prisma.user.findUnique({
               where:{
                   vendor_id:data.vendor_id
               },
            });

            if (existVendor) {
               throw new BadRequestException("Vendor ID already exists")
            }
         }

         const user = await prisma.user.create({
            data:{
                firstName:data.firstName,
                lastName:data.lastName,
                email:data.email,
                password:await argon2.hash(data.password),
                profile_picture:data.profile_picture,
                organization_name:data.organization_name,
                posterAddress:data.posterAddress,
                mainAddress:data.mainAddress,
                contactNumber:data.contactNumber,
                businessSector:data.businessSector,
                businessRegion:data.businessRegion,
                taxId:data.taxId,
                status:data.status,
                user_type:data.user_type,
                vendor_id:data.vendor_id,
                expires_at:data.expires_at
            },
         });

         return user; 
        } catch (error:any) {
            console.log(error);
            throw new BadRequestException(this.getDatabaseErrorMessage(error));
        }
    }

    async loginUser(email:string, password:string){
        try {
            const user = await prisma.user.findUnique({
                where:{
                   email:email 
                }
            })

            if (!user) {
                throw new BadRequestException("Invalid Credentials")
            }
            if (await argon2.verify(user.password, password)) {
                const token = await this.signinJwt(user.id, user.email);
                const { password: _, ...safeUser } = user;
                
                return {
                    user: safeUser,
                    access_token: token
                };
            } else {
                throw new BadRequestException("Invalid Credentials")

            }

        } catch (error:any) {
            console.log(error);
            throw new BadRequestException('Unable to login. Please check your credentials.');
        }
    }

    async signinJwt(userId:number, email:string){
        const payload={
            sub:userId,
            email:email
        }
        return this.jwt.signAsync(
            payload,
            {
                expiresIn:'7d',
                secret:process.env.JWT_SECRET_KEY
            }
        )
    }

    private async createActivityLog(data: {
        actorId?: number;
        targetUserId?: number;
        action: string;
        details?: string;
        variant?: string;
    }) {
        return prisma.activityLog.create({
            data: {
                actorId: data.actorId,
                targetUserId: data.targetUserId,
                action: data.action,
                details: data.details,
                variant: data.variant || 'blue'
            }
        });
    }

    async updateUser(id:number, data: Partial<UpdateUserDto>) {
        try {
            const existingUser = await prisma.user.findUnique({ where: { id } });
            if (!existingUser) {
                throw new BadRequestException('User not found');
            }

            if (data.email && data.email !== existingUser.email) {
                const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
                if (emailExists) {
                    throw new BadRequestException('Email already exists');
                }
            }

            if (data.organization_name && data.organization_name !== existingUser.organization_name) {
                const orgExists = await prisma.user.findUnique({ where: { organization_name: data.organization_name } });
                if (orgExists) {
                    throw new BadRequestException('Organization name already exists');
                }
            }

            if (data.vendor_id && data.vendor_id !== existingUser.vendor_id) {
                const vendorExists = await prisma.user.findUnique({ where: { vendor_id: data.vendor_id } });
                if (vendorExists) {
                    throw new BadRequestException('Vendor ID already exists');
                }
            }

            const updatePayload: any = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                profile_picture: data.profile_picture,
                organization_name: data.organization_name || data.vendorName,
                posterAddress: data.posterAddress,
                mainAddress: data.mainAddress,
                contactNumber: data.contactNumber,
                businessSector: data.businessSector,
                businessRegion: data.businessRegion,
                taxId: data.taxId,
                user_type: data.user_type,
                vendor_id: data.vendor_id,
                expires_at: data.expires_at,
                status: data.status,
            };

            if (data.password) {
                updatePayload.password = await argon2.hash(data.password);
            }

            Object.keys(updatePayload).forEach((key) => {
                if (updatePayload[key] === undefined) {
                    delete updatePayload[key];
                }
            });

            if (Object.keys(updatePayload).length === 0) {
                return existingUser;
            }

            const user = await prisma.user.update({
                where: { id },
                data: updatePayload,
            });

            await this.createActivityLog({
                actorId: id,
                targetUserId: id,
                action: existingUser.user_type === 'vendor' ? 'Updated vendor profile.' : 'Updated profile.',
                details: `Updated fields: ${Object.keys(updatePayload).join(', ')}`,
                variant: 'blue'
            });

            const { password, ...safeUser } = user;
            return safeUser;
        } catch (error:any) {
            console.log(error);
            throw new BadRequestException(this.getDatabaseErrorMessage(error));
        }
    }

    async getApplicants(){
        try {
            const applicants = await prisma.user.findMany({
                where: {
                    user_type: {
                        in: ['applicant', 'user']
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    organization_name: true,
                    status: true,
                    created_at: true
                }
            });
            return applicants;
        } catch (error) {
            throw new BadRequestException('Failed to fetch applicants');
        }
    }

    async createAdmin(data: CreateAdminDto) {
        try {
            const existEmail = await prisma.user.findUnique({
                where: {
                    email: data.email
                },
            });

            if (existEmail) {
                throw new BadRequestException("Email already exists");
            }

            // Generate a random password
            const generatedPassword = Math.random().toString(36).slice(-8); // Simple 8-char password

            const user = await prisma.user.create({
                data: {
                    firstName: 'Admin',
                    lastName: 'User',
                    email: data.email,
                    password: await argon2.hash(data.password),
                    organization_name: `Admin-${data.email}`, // Unique org name
                    user_type: 'admin',
                    status: 'ACTIVE'
                },
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    user_type: user.user_type,
                    status: user.status
                },
                generatedPassword: generatedPassword // Return the plain password
            };
        } catch (error: any) {
            console.log(error);
            throw new BadRequestException(this.getDatabaseErrorMessage(error));
        }
    }

    async getAdminStats() {
        try {
            const totalVendors = await prisma.user.count({
                where: { user_type: 'vendor' }
            });

            const verifiedVendors = await prisma.user.count({
                where: { user_type: 'vendor', status: 'VERIFIED' }
            });

            const deniedVendors = await prisma.user.count({
                where: { user_type: 'vendor', status: 'REJECTED' }
            });

            const pendingApplications = await prisma.user.count({
                where: { user_type: 'applicant', status: 'PENDING' }
            });

            const suspendedVendors = await prisma.user.count({
                where: { user_type: 'vendor', status: 'SUSPENDED' }
            });

            // Expiring soon: expires_at within 30 days
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            const expiringSoon = await prisma.user.count({
                where: {
                    user_type: 'vendor',
                    expires_at: {
                        lte: thirtyDaysFromNow,
                        gte: new Date()
                    }
                }
            });

            return {
                totalVendors,
                verifiedVendors,
                deniedVendors,
                pendingApplications,
                suspendedVendors,
                expiringSoon
            };
        } catch (error) {
            throw new BadRequestException('Failed to fetch admin stats');
        }
    }

    async getVendors() {
        try {
            const vendors = await prisma.user.findMany({
                where: {
                    user_type: 'vendor'
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    organization_name: true,
                    status: true,
                    vendor_id: true,
                    expires_at: true,
                    created_at: true
                }
            });
            return vendors;
        } catch (error) {
            throw new BadRequestException('Failed to fetch vendors');
        }
    }

    async getVendorByVendorId(vendorId: string) {
        try {
            const vendor = await prisma.user.findFirst({
                where: {
                    vendor_id: vendorId,
                    user_type: 'vendor'
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profile_picture: true,
                    organization_name: true,
                    posterAddress: true,
                    mainAddress: true,
                    contactNumber: true,
                    businessSector: true,
                    businessRegion: true,
                    taxId: true,
                    status: true,
                    vendor_id: true,
                    expires_at: true,
                    created_at: true,
                    updated_at: true
                }
            });
            if (!vendor) {
                throw new BadRequestException('Vendor not found');
            }
            return vendor;
        } catch (error) {
            throw new BadRequestException('Failed to fetch vendor profile');
        }
    }

    async getApplicantByEmail(email: string) {
        try {
            const applicant = await prisma.user.findFirst({
                where: {
                    email: email,
                    user_type: {
                        in: ['applicant', 'user']
                    }
                }
            });
            if (!applicant) {
                throw new BadRequestException('Applicant not found');
            }
            return applicant;
        } catch (error) {
            throw new BadRequestException('Failed to fetch applicant');
        }
    }

    async getRecentActivity() {
        try {
            const logs = await prisma.activityLog.findMany({
                orderBy: {
                    created_at: 'desc'
                },
                take: 5,
                include: {
                    actor: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    targetUser: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            return logs.map((log) => {
                const actorName = log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : 'System';
                const targetName = log.targetUser ? `${log.targetUser.firstName} ${log.targetUser.lastName}` : null;
                return {
                    id: log.id,
                    name: targetName || actorName,
                    action: log.action,
                    details: log.details,
                    time: log.created_at,
                    variant: log.variant || 'blue'
                };
            });
        } catch (error) {
            throw new BadRequestException('Failed to fetch recent activity');
        }
    }

    async promoteToVendor(id: number, data: { vendor_id: string, expires_at: Date }) {
        try {
            const user = await prisma.user.update({
                where: { id },
                data: {
                    user_type: 'vendor',
                    vendor_id: data.vendor_id,
                    expires_at: data.expires_at,
                    status: 'VERIFIED'
                }
            });

            await this.createActivityLog({
                targetUserId: user.id,
                action: `${user.firstName} ${user.lastName} was promoted to vendor.`,
                details: `Vendor ID ${data.vendor_id}`,
                variant: 'green'
            });

            return user;
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Failed to promote applicant to vendor');
        }
    }
    async getUserProfile(id: number) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profile_picture: true,
                    organization_name: true,
                    posterAddress: true,
                    mainAddress: true,
                    contactNumber: true,
                    businessSector: true,
                    businessRegion: true,
                    taxId: true,
                    status: true,
                    user_type: true,
                    vendor_id: true,
                    expires_at: true,
                    created_at: true,
                    updated_at: true
                }
            });
            if (!user) {
                throw new BadRequestException('User not found');
            }
            return user;
        } catch (error) {
            throw new BadRequestException('Failed to fetch user profile');
        }
    }}
