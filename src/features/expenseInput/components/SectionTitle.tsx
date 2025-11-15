import React from 'react';
import styled from 'styled-components/native';

interface SectionTitleProps {
    children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
    return <Title>{children}</Title>;
}

const Title = styled.Text`
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: ${({ theme }) => theme.colors.black[60]};
    margin-bottom: 12px;
`;
