import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/backend';
import dbConnect from '@/utils/mongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// Webhook handler
export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to your .env file');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  await dbConnect();

  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    const newUser = new User({
      clerkId: id,
      email: email_addresses[0]?.email_address || '',
      username: username || '',
      firstName: first_name || '',
      lastName: last_name || '',
      photo: image_url || '',
    });

    try {
      const savedUser = await newUser.save();

      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: savedUser._id,
        },
      });

      return NextResponse.json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
      console.error('Error saving user:', error);
      return NextResponse.json({ error: 'Error saving user to database' }, { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name, username } = evt.data;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: first_name || '',
          lastName: last_name || '',
          username: username || '',
          photo: image_url || '',
        },
        { new: true }
      );

      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Error updating user in database' }, { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Error deleting user from database' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Unhandled event type' }, { status: 200 });
}
