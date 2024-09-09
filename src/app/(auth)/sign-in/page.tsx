import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useSession, signIn, signOut } from "next-auth/react"


function page() {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await axios.post('')
    } catch (error) {

    }
  }
  return (
    <div>page</div>
  )
}

export default page