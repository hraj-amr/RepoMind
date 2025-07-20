import { db } from '@/server/db'; // Database client (e.g., Prisma)
import { auth, clerkClient } from '@clerk/nextjs/server'; // Clerk authentication utilities
import { notFound, redirect } from 'next/navigation'; // Next.js navigation utilities

// SyncUser is an asynchronous functional component that handles user synchronization
// with the database upon authentication.
const SyncUser = async () => {
    // Get the current user's ID from Clerk's authentication.
    // Await the auth() call to get the resolved authentication object.
    const { userId } = await auth();

    // If no userId is found, it means the user is not authenticated.
    // In a real application, you might redirect to a sign-in page or handle
    // this more gracefully, but for now, we'll throw an error as per original code.
    if (!userId) {
        throw new Error('User not found'); // Or redirect('/sign-in')
    }

    // Fetch user details from Clerk using the userId.
    // 'clerkClient' is already the client instance, so you directly access its properties.
    // No need to call 'clerkClient()' as a function.
    const user = await clerkClient.users.getUser(userId); // FIX: Removed the intermediate 'client' variable and direct call

    // Check if the user has a primary email address. If not, return a 404 page.
    // This is crucial as the emailAddress is used as a unique identifier for upsert.
    if (!user.emailAddresses[0]?.emailAddress) {
        return notFound();
    }

    // Upsert (update or insert) the user data into your database.
    // This ensures that the user's information in your database is always
    // in sync with Clerk's data.
    await db.user.upsert({
        // 'where' clause to find an existing user by their email address
        where: {
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "" // Use nullish coalescing for safety
        },
        // 'update' data for existing users
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        // 'create' data for new users
        create: {
            id: userId, // Use Clerk's userId as the primary key in your database
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    });

    // After successfully syncing the user, redirect them to the dashboard.
    return redirect('/dashboard');
};

export default SyncUser;
