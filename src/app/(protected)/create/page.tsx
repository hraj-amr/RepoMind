'use client';
import React from 'react';
import "@/styles/globals.css";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import useRefetch from '@/hooks/use-refetch'


// Define the type for the form inputs
type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string; // Optional GitHub token
};


const CreatePage = () => { 
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    function onSubmit(data: FormInput) {
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project created successfully'); 
                refetch(); 
                reset(); 
            },
            onError: () => {
                toast.error('Failed to create project');
            }
        });
        return true;
    }

    return (
        <div className='flex item-center gap-12 h-full justify-center'>
            {/* Image for visual appeal */}
            <img src='/undraw_github.svg' className='h-56 w-auto' alt='GitHub illustration' />
            <div>
                {/* Section for title and description */}
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your GitHub Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository to link it to RepoMind
                    </p>
                </div>
                <div className='h-4'></div> {/* Spacer */}
                {/* Form for project creation */}
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Project Name Input */}
                        <Input
                            {...register('projectName', { required: true })}
                            placeholder='Project Name'
                            required
                        />
                        <div className='h-2'></div> {/* Spacer */}
                        {/* GitHub URL Input */}
                        <Input
                            {...register('repoUrl', { required: true })}
                            placeholder='GitHub URL'
                            type='url'
                            required
                        />
                        <div className='h-2'></div> {/* Spacer */}
                        {/* GitHub Token Input (Optional) */}
                        <Input
                            {...register('githubToken')}
                            placeholder='GitHub Token (Optional)'
                        />
                        <div className='h-4'></div> {/* Spacer */}
                        {/* Submit Button */}
                        <Button type='submit' disabled={createProject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
