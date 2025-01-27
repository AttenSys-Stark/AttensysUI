import React, { useState } from 'react'
import { Button, Field, Input } from '@headlessui/react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation';
import {organzationInitState} from "@/state/connectedWalletStarknetkitNext"
import { useAtom } from 'jotai'

const Admininfo = () => {
    const router = useRouter();
    const [organizationData, setOrganizationData] = useAtom(organzationInitState)

    // State for tracking errors
    const [errors, setErrors] = useState({
        organizationAdminfullname: '',
        organizationAminEmail: '',
        organizationAdminWallet: ''
    });

    const handlerouting = (prop : string) =>{
        // Validate all fields before routing
        const newErrors = {
            organizationAdminfullname: !organizationData.organizationAdminfullname ? 'Admin name is required' : '',
            organizationAminEmail: !organizationData.organizationAminEmail ? 'Email address is required' : '',
            organizationAdminWallet: !organizationData.organizationAdminWallet ? 'Wallet address is required' : ''
        };

        setErrors(newErrors);

        // Check if any errors exist
        const hasErrors = Object.values(newErrors).some(error => error !== '');

        // Only route if no errors
        if (!hasErrors) {
            router.push(`/Createorganization/${prop}`)
        }
    }

    const handleAdminNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOrganizationData((prevData) => ({
          ...prevData,
          organizationAdminfullname: value
        }));

        // Clear error when input changes
        setErrors(prev => ({
            ...prev,
            organizationAdminfullname: value ? '' : 'Admin name is required'
        }));
    }

    const handleEmailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOrganizationData((prevData) => ({
          ...prevData,
          organizationAminEmail: value
        }));

        // Clear error when input changes
        setErrors(prev => ({
            ...prev,
            organizationAminEmail: value ? '' : 'Email address is required'
        }));
    }

    const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOrganizationData((prevData) => ({
          ...prevData,
          organizationAdminWallet: value
        }));

        // Clear error when input changes
        setErrors(prev => ({
            ...prev,
            organizationAdminWallet: value ? '' : 'Wallet address is required'
        }));
    }

  return (
    <div className='h-auto w-full flex flex-col items-center space-y-8 py-6'>
                 <div className='space-y-3 w-[60%]'>
                    <h1 className='text-[16px] text-[#2D3A4B] font-light leading-[23px]'>Admin&apos;s Full Name</h1>
                    <Field>
                        <Input
                        placeholder='Your full name'
                        onChange={handleAdminNameChange}
                        className={clsx(
                            'h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                            errors.organizationAdminfullname && 'border-red-500'
                        )}
                        />
                    </Field>
                    {errors.organizationAdminfullname && (
                        <p className='text-red-500 text-sm mt-1'>{errors.organizationAdminfullname}</p>
                    )}
                </div>

                <div className='space-y-3 w-[60%]'>
                    <h1 className='text-[16px] text-[#2D3A4B] font-light leading-[23px]'>Preferred Email Address</h1>
                    <Field>
                        <Input
                        placeholder='Enter email address'
                        onChange={handleEmailAddressChange}
                        className={clsx(
                            'h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                            errors.organizationAminEmail && 'border-red-500'
                        )}
                        />
                    </Field>
                    {errors.organizationAminEmail && (
                        <p className='text-red-500 text-sm mt-1'>{errors.organizationAminEmail}</p>
                    )}
                </div>

                <div className='space-y-3 w-[60%]'>
                    <h1 className='text-[16px] text-[#2D3A4B] font-light leading-[23px]'>Admin Wallet address</h1>
                    <Field>
                        <Input
                        placeholder='Enter admin wallet address'
                        onChange={handleWalletAddressChange}
                        className={clsx(
                            'h-[55px] border-[2px] bg-[#FFFFFF] border-[#D0D5DD] block w-[100%] rounded-lg  py-1.5 px-3 text-sm/6 text-[#667185]',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                            errors.organizationAdminWallet && 'border-red-500'
                        )}
                        />
                    </Field>
                    {errors.organizationAdminWallet && (
                        <p className='text-red-500 text-sm mt-1'>{errors.organizationAdminWallet}</p>
                    )}
                </div>

        <Button 
            onClick={()=>{handlerouting("add-instructors")}} 
            className="w-[342px] h-[47px] flex justify-center items-center text-[#FFFFFF] text-[14px] font-bold leading-[16px] bg-[#4A90E2] rounded-xl"
        >
            Verify
        </Button>
    </div>
  )
}

export default Admininfo