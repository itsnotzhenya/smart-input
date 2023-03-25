import { useCallback, useState, useEffect, useMemo } from 'react';
import { SmartForm } from '../SmartForm';
import './styles.css';

interface FieldConfig {
  id: string;
  type: 'inputText' | 'inputEmail' | 'inputPassword';
  label?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export const AuthForm = () => {
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);

  const fields: FieldConfig[] = useMemo(
    () => [
      {
        id: 'first_name',
        type: 'inputText',
        defaultValue: 'Ivan',
        placeholder: 'Введите имя',
      },
      {
        id: 'last_name',
        type: 'inputText',
        defaultValue: 'Ivanov',
        placeholder: 'Введите фамилию ',
      },
      {
        id: 'email',
        type: 'inputEmail',
        placeholder: 'Введите адрес эл. почты',
        required: true,
      },
      {
        id: 'password',
        type: 'inputPassword',
        placeholder: 'Введите пароль',
        required: true,
      },
    ],
    []
  );

  const isFormValid = (
    config: FieldConfig[],
    values: { [key: string]: string }
  ) => {
    return config.every(
      (field: FieldConfig) => !field.required || !!values[field.id]
    );
  };

  const isEmailValid = (email: string) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  useEffect(() => {
    if (!!fieldValues['email']) {
      setEmailIsValid(isEmailValid(fieldValues['email']));
    }

    setIsSubmitEnabled(isFormValid(fields, fieldValues) && emailIsValid);
  }, [fieldValues, emailIsValid, fields]);

  const handleChange = (newValues: { [key: string]: string }) => {
    setFieldValues(newValues);
  };

  const handleSubmit = useCallback(() => {
    console.log('Submitted values:', fieldValues);
    setIsSubmitted(true);
  }, [fieldValues]);

  return (
    <div className="formContainer">
      {isSubmitted ? (
        <>
          <h1 className="emoji">🙋🏻‍♀️</h1>
          <h1 className="title">
            {`С возвращением, ${fieldValues.first_name} ${fieldValues.last_name}!`}
          </h1>
        </>
      ) : (
        <>
          <h1 className="emoji">💁🏻‍♀️</h1>
          <h1 className="title">Авторизация</h1>
          <p className="subtitle">
            Для доступа к личному кабинету вашей комании авторизуйтесь на сайте
          </p>
          <SmartForm
            config={fields}
            onChange={handleChange}
            error={
              !emailIsValid ? 'Упс, некорректный адрес эл. почты' : undefined
            }
          />
          <button
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            className="submit"
            type="submit">
            Войти
          </button>
        </>
      )}
    </div>
  );
};
