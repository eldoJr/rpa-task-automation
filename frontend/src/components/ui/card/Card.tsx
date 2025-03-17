import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
};

export default Card;