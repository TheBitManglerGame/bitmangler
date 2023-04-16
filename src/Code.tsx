import styled from 'styled-components';

export const Code = styled.pre`
  background-color: #f5f5f5; // Light gray background
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace; // A monospaced font
  font-size: 14px;
  white-space: pre-wrap; // Wrap text if necessary
  overflow-x: auto; // Add horizontal scrollbar if needed
`;

export const CodeContent = styled.code`
  display: block;
`;
