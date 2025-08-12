import { UserForm } from '@/presentation/components/UserForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Clean Architecture Demo</h1>
        <UserForm />
      </div>
    </main>
  );
}
