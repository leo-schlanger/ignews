import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripejs';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

interface UserSubscriptionSession extends Session {
  activeSubscription?: any;
}

type SessionProps = [UserSubscriptionSession, boolean]

export function SubscribeButton({priceId}: SubscribeButtonProps) {
  const [session]: SessionProps = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if(!session) {
      signIn('github');
      return;
    }
    console.log(session)

    if(session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('subscribe');

      const {sessionId} = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({sessionId});
    }catch(error) {
      alert(error.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}