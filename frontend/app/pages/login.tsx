import { useForm } from 'react-hook-form';

export default function Login() {
    const { register, handleSubmit } = useForm();

    function handleSignIn(data) {
        console.log('dados:', data);
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit(handleSignIn)}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1">Usuário:</label>
                        <input
                            {...register('nome')}
                            id="nome"
                            name='nome'
                            className="w-full px-4 py-2 border rounded-md"
                            type="text"
                            placeholder='Nome de Usuário'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-1" htmlFor="password">Password:</label>
                        <input
                            {...register('password')}
                            id="password"
                            name='password'
                            className="w-full px-4 py-2 border rounded-md"
                            type="password"
                            placeholder='********'
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
