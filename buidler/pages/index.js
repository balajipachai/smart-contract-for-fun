import Link from 'next/link';

export default function Index() {
    return (
        <div>
            <h1>Copyright Registration</h1>
            <h2>
                <Link href="/store">
                    <a>Store Copyright</a>
                </Link>
            </h2>
        </div>
    );
}