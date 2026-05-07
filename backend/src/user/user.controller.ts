import { Body, Controller, Get, Post, Put, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('api')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('user/sign-up')
    async SignUp(@Body() data: UserDto) {
        return this.userService.createUser(data);
    }

    @Post('user/login')
    async Login(@Body() data: { email: string, password: string }) {
        return this.userService.loginUser(data.email, data.password);       
    }

    @Post('user/logout')
    async Logout() {
        return { success: true, message: 'Logged out successfully' };
    }

    @Put('user/profile')
    async UpdateProfile(@Body() data: UpdateUserDto) {
        if (!data.id) {
            throw new BadRequestException('User id is required for profile update');
        }
        return this.userService.updateUser(data.id, data as any);
    }

    @Get('admin/applicants')
    async GetApplicants() {
        return this.userService.getApplicants();
    }

    @Post('admin/register')
    async RegisterAdmin(@Body() data: UserDto) {
        const adminData = { ...data, user_type: 'admin' };
        return this.userService.createUser(adminData);
    }

    @Post('admin/create-vendor')
    async CreateVendor(@Body() data: UserDto) {
        const vendorData = { ...data, user_type: 'vendor' };
        return this.userService.createUser(vendorData);
    }

    @Post('admin/create-admin-simple')
    async CreateAdminSimple(@Body() data: CreateAdminDto) {
        return this.userService.createAdmin(data);
    }

    @Get('admin/stats')
    async GetAdminStats() {
        return this.userService.getAdminStats();
    }

    @Get('admin/vendors')
    async GetVendors() {
        return this.userService.getVendors();
    }

    @Get('vendor/:vendorId')
    async GetVendorByVendorId(@Param('vendorId') vendorId: string) {
        return this.userService.getVendorByVendorId(vendorId);
    }

    @Get('admin/recent-activity')
    async GetRecentActivity() {
        return this.userService.getRecentActivity();
    }

    @Get('admin/applicant/:email')
    async GetApplicantByEmail(@Param('email') email: string) {
        return this.userService.getApplicantByEmail(email);
    }

    @Get('user/profile/:id')
    async GetUserProfile(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserProfile(id);
    }

    @Put('admin/promote-vendor/:id')
    async PromoteToVendor(@Param('id') id: number, @Body() data: { vendor_id: string, expires_at: Date }) {
        return this.userService.promoteToVendor(id, data);
    }

    @Post('user/request-email-verification')
    async RequestEmailVerification(@Body() data: { email: string }) {
        return this.userService.requestEmailVerification(data.email);
    }

    @Post('user/verify-email')
    async VerifyEmail(@Body() data: { email: string; code: string }) {
        return this.userService.verifyEmailCode(data.email, data.code);
    }

}
