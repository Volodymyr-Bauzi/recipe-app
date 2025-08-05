// RecipePage/FormattedText.tsx
import React from 'react';

interface FormattedTextProps {
  text: string | undefined;
  fallback: string;
  listClassName: string;
  ordered: boolean;
}

const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  fallback,
  listClassName,
  ordered,
}) => {
  if (!text) return <p>{fallback}</p>;

  const items = text.split('\n').filter((item) => item.trim());

  if (items.length <= 1) return <p>{text}</p>;

  const ListComponent = ordered ? 'ol' : 'ul';

  return (
    <ListComponent className={listClassName}>
      {items.map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ListComponent>
  );
};

export default FormattedText;
