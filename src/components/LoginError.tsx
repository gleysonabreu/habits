import { useTranslation } from 'next-i18next';

export declare type SignInErrorTypes =
  | 'Signin'
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'EmailCreateAccount'
  | 'Callback'
  | 'OAuthAccountNotLinked'
  | 'EmailSignin'
  | 'CredentialsSignin'
  | 'SessionRequired'
  | 'default';

type LoginErrorProps = {
  errorType: SignInErrorTypes;
};
export function LoginError({ errorType }: LoginErrorProps) {
  const { t: translate } = useTranslation('common');

  const errors = {
    Signin: translate('messages.signin'),
    OAuthSignin: translate('messages.o_auth_signin'),
    OAuthCallback: translate('messages.o_auth_callback'),
    OAuthCreateAccount: translate('messages.o_auth_create_account'),
    EmailCreateAccount: translate('messages.email_create_account'),
    Callback: translate('messages.callback'),
    OAuthAccountNotLinked: translate('messages.o_auth_account_not_linked'),
    EmailSignin: translate('messages.email_signin'),
    CredentialsSignin: translate('messages.credentials_signin'),
    SessionRequired: translate('messages.session_required'),
    default: translate('messages.default'),
  };

  let _errors;
  const error =
    errorType &&
    ((_errors = errors[errorType]) !== null && _errors !== void 0
      ? errors[errorType]
      : errors.default);

  return (
    <div className="w-full bg-red-500 text-red-50 p-2 rounded-lg text-center">
      {error}
    </div>
  );
}
