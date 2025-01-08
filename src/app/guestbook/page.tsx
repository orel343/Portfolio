import { GuestbookForm } from '@/app/components/guestbook-form';
import { getFeedback } from '@/app/lib/feedback';

export default async function GuestbookPage() {
  const feedback = await getFeedback();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Guestbook</h1>
        <p className="mt-2 text-muted-foreground">
          Leave a comment below. It could be anything - appreciation, information,
          wisdom, or even humor. Surprise me!
        </p>
        <div className="mt-8">
          <GuestbookForm />
        </div>
        <div className="mt-8 space-y-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card p-4 text-card-foreground"
            >
              <p>{item.content}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

