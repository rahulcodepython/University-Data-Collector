"use client"
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import axios from 'axios';
import { Check, Loader2Icon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

interface FormType {
    name: 'student_code' | 'name' | 'mobile' | 'place_of_living' | 'home_address' | 'pg_address' | 'pg_name' | 'pg_landmark' | 'pg_owner_mobile' | 'pg_owner_name';
    label: string;
    type: 'text' | 'number' | 'radio' | 'textarea';
    placeholder: string;
    before: boolean;
    options?: { value: string, label: string }[];
    size?: number;
}

const fields = [
    {
        name: "student_code",
        label: 'Student Code',
        type: 'number',
        placeholder: '406',
        before: true,
        size: 3
    },
    {
        name: "name",
        label: 'Name',
        type: 'text',
        placeholder: 'Enter you name',
        before: false
    },
    {
        name: "mobile",
        label: 'Mobile Number',
        type: 'number',
        placeholder: 'Enter you mobile number',
        before: true,
        size: 10
    },
    {
        name: "place_of_living",
        label: 'Place of Living',
        type: 'radio',
        placeholder: '',
        before: false,
        options: [
            {
                value: 'home',
                label: 'Home'
            },
            {
                value: 'pg',
                label: 'PG'
            }
        ]
    },
    {
        name: "home_address",
        label: 'Home Address',
        type: 'textarea',
        placeholder: 'Enter you home address',
        before: false
    },
    {
        name: "home_ps",
        label: 'Home Police Station',
        type: 'text',
        placeholder: 'Enter you home police station',
        before: false
    },
    {
        name: "home_pin",
        label: 'Home Pin',
        type: 'number',
        placeholder: 'Enter you home pin',
        before: false,
        size: 6
    },
    {
        name: "home_state",
        label: 'Home State',
        type: 'text',
        placeholder: 'Enter you home state',
        before: false
    },
    {
        name: "home_district",
        label: 'Home District',
        type: 'text',
        placeholder: 'Enter you home district',
        before: false
    },
    {
        name: "pg_address",
        label: 'PG Address',
        type: 'text',
        placeholder: 'Enter you pg address',
        before: false
    },
    {
        name: "pg_name",
        label: 'PG Name',
        type: 'text',
        placeholder: 'Enter you pg name',
        before: false
    },
    {
        name: "pg_landmark",
        label: 'Nearest Landmark',
        type: 'text',
        placeholder: 'Enter you nearest landmark',
        before: false
    },
    {
        name: "pg_owner_mobile",
        label: 'Owner Mobile',
        type: 'number',
        placeholder: 'Enter you owner mobile number',
        before: false,
        size: 10
    },
    {
        name: "pg_owner_name",
        label: 'Owner Name',
        type: 'text',
        placeholder: 'Enter you owner name',
        before: false
    }
] as FormType[];

interface InputData {
    home_address?: string;
    home_district?: string;
    home_pin?: string;
    home_ps?: string;
    home_state?: string;
    mobile?: string;
    name?: string;
    pg_address?: string;
    pg_landmark?: string;
    pg_name?: string;
    pg_owner_mobile?: string;
    pg_owner_name?: string;
    place_of_living: 'home' | 'pg';
    student_code?: string;
}

const schema = z.object({
    student_code: z.string().length(3, { message: "Must be exactly 3 characters long." }),
    name: z.string().min(2, { message: "Name must be atleast 2 characters long." }),
    mobile: z.string().length(10, { message: "Mobile number must be exactly 10 characters long." }),
    place_of_living: z.enum(['pg', 'home'], { required_error: "You need to select yout residental details." }),
    home_address: z.string().min(2, { message: "Address must be atleast 2 characters long." }).optional(),
    home_ps: z.string().min(2, { message: "Police station must be atleast 2 characters long." }).optional(),
    home_pin: z.string().length(6, { message: "PIN must be exactly 6 characters long." }).optional(),
    home_state: z.string().min(2, { message: "State must be atleast 2 characters long." }).optional(),
    home_district: z.string().min(2, { message: "District must be atleast 2 characters long." }).optional(),
    pg_address: z.string().min(2, { message: "Address must be atleast 2 characters long." }).optional(),
    pg_name: z.string().min(2, { message: "Name must be atleast 2 characters long." }).optional(),
    pg_landmark: z.string().min(2, { message: "Landmark must be atleast 2 characters long." }).optional(),
    pg_owner_mobile: z.string().length(10, { message: "Mobile number must be exactly 10 characters long." }).optional(),
    pg_owner_name: z.string().min(2, { message: "Name must be atleast 2 characters long." }).optional(),
}).refine(data => {
    if (data.place_of_living === 'home') {
        data.home_address = "Address: " + data.home_address + ', PS: ' + data.home_ps + ', PIN: ' + data.home_pin + ', State: ' + data.home_state + ', District: ' + data.home_district;
        return data.home_address;
    }
    if (data.place_of_living === 'pg') {
        return data.pg_address && data.pg_name && data.pg_landmark && data.pg_owner_mobile && data.pg_owner_name;
    }
    return true;
}, {
    message: "All relevant fields must be filled",
    path: ["student_code"],
});

const Home: React.FC = () => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            student_code: '',
            name: '',
            mobile: '',
            place_of_living: undefined
        }
    })

    const { toast } = useToast()

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAcknowledged, setIsAcknowledged] = useState(false);

    const studentCode = form.watch('student_code');
    const placeOfLiving = form.watch('place_of_living');

    const filterData = (data: InputData) => {
        const filteredData: Partial<InputData> = { ...data };

        if (data.place_of_living === 'home') {
            Object.keys(filteredData).forEach(key => {
                if (key.startsWith('pg') || ['home_pin', 'home_state', 'home_district', 'home_ps'].includes(key)) {
                    delete (filteredData as any)[key];
                }
            });
        } else if (data.place_of_living === 'pg') {
            Object.keys(filteredData).forEach(key => {
                if (key.startsWith('home')) {
                    delete (filteredData as any)[key];
                }
            });
        }

        return { ...filteredData, student_code: 'BWU/BCA/23/' + data.student_code };
    };

    const shouldRenderFormFields = (placeOfLiving: string | undefined, itemName: string): boolean => {
        if (placeOfLiving === 'home' && itemName.includes('pg')) return false;
        if (placeOfLiving === 'pg' && itemName.includes('home')) return false;
        if (placeOfLiving === undefined && (itemName.startsWith('home') || itemName.startsWith('pg'))) return false;
        return true;
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/upload', filterData(data));
            toast({ title: response.data.message })
            form.reset();
        } catch (error: any) {
            toast({ variant: "destructive", title: error?.message })
        } finally {
            setIsSubmitting(false);
        }
    };

    return <Card className="max-w-7xl w-full">
        <CardHeader>
            <CardTitle>
                Brainware University Data Collection
            </CardTitle>
            <CardDescription>
                This is a data collection form for Brainware University students. Please fill all the inputs in the form below carefully.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className='space-y-4 max-h-[600px] min-h-[200px] h-full overflow-y-scroll'>
                    {
                        fields.map(item => {
                            return <FormField
                                key={item.name}
                                control={form.control}
                                name={item.name}
                                render={({ field }) => {
                                    return shouldRenderFormFields(placeOfLiving, item.name) ? <FormFields field={field} item={item} studentCode={studentCode} /> : <></>;
                                }
                                }
                            />
                        })
                    }
                </CardContent>
                <CardFooter className='flex items-center justify-between mt-4'>
                    <div className='flex items-center gap-2'>
                        <input type="checkbox" id="acknowledge" onChange={() => setIsAcknowledged(!isAcknowledged)} />
                        <label htmlFor="acknowledge" className='text-sm text-gray-400'>I acknowledge that the information provided above is correct.</label>
                    </div>
                    {
                        isSubmitting ? <Button type='button'>
                            <Loader2Icon className='w-6 h-6' />
                            Submitting...
                        </Button>
                            : <Button type="submit" disabled={!isAcknowledged}>Submit</Button>}
                </CardFooter>
            </form>
        </Form>
    </Card>
};

const FormFields = ({ field, item, studentCode }: {
    field: any,
    item: FormType,
    studentCode: string | undefined
}) => {
    return <FormItem>
        <FormLabel>
            {item.label}
        </FormLabel>
        <FormControl>
            <div className='flex items-center gap-2'>
                {
                    item.before && <strong className='text-sm text-gray-400'>
                        {
                            item.name === 'student_code' ? 'BWU/BCA/23/' : item.name === 'mobile' ? '+91 ' : ''
                        }
                    </strong>
                }
                {
                    item.name === 'student_code' ? <StudentCodeField field={field} item={item} studentCode={studentCode} /> : item.type === 'radio' ? <RadioGroup
                        name={item.name}
                        value={field.value}
                        onValueChange={field.onChange}>
                        {
                            item.options?.map((option: { value: string, label: string }) => {
                                return <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value}>{option.label}</Label>
                                </div>
                            })
                        }
                    </RadioGroup> : item.type === 'textarea' ? <Textarea placeholder={item.placeholder} {...field} required />
                        : item.type === 'number' ? <Input placeholder={item.placeholder} {...field} type={item.type} size={item?.size} />
                            : <Input placeholder={item.placeholder} {...field} type={item.type} />
                }
            </div>
        </FormControl>
        <FormMessage />
    </FormItem>
}

const StudentCodeField = ({ field, item, studentCode }: {
    field: any,
    item: FormType,
    studentCode: string | undefined
}) => {
    const [check, setCheck] = useState(false);
    const [loading, setLoading] = useState(false);

    const CheckStudentExists = async () => {
        setLoading(true);
        try {
            await axios.post('/api/verify', { student_code: 'BWU/BCA/23/' + studentCode });
            setCheck(true);
        } catch (error) {
            setCheck(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <div className='flex items-center gap-4 w-full'>
        <Input placeholder={item.placeholder} {...field} type={item.type} />
        {check && <Check className='w-6 h-6 text-green-400' />}
        {
            loading ? <Button type='button'>
                <Loader2Icon className='w-6 h-6' />
                Loading...
            </Button> : <Button onClick={() => CheckStudentExists()} type='button'>
                Check
            </Button>
        }
    </div>
}

export default Home;
