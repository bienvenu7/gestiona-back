import generatePassword from 'generate-password';

export const genPassword = () => {
  const password = generatePassword.generate({
    length: Math.floor(Math.random() * 7) + 6, // 6-12 chars
    numbers: true,
    uppercase: true,
    lowercase: true,
    strict: true,
  });

  return password;
};
