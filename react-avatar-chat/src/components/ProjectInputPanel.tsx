import React from 'react';
import styled from 'styled-components';

interface ProjectInputPanelProps {
  onProjectDetailsChange: (text: string) => void;
  onProjectDetailsBlur?: (text: string) => void;
  projectDetails: string;
}

const Panel = styled.div`
  background: linear-gradient(135deg, rgba(0, 120, 212, 0.05), rgba(104, 33, 122, 0.05));
  border: 2px solid rgba(0, 120, 212, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  backdrop-filter: blur(10px);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 120, 212, 0.02), rgba(104, 33, 122, 0.02));
    border-radius: 10px;
    z-index: -1;
  }
`;

const Title = styled.h2`
  color: #0078d4;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 2px solid rgba(0, 120, 212, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  resize: vertical;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #0078d4;
    box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
    background: white;
  }
  
  &::placeholder {
    color: #666;
    line-height: 1.6;
  }
`;

const CharacterCount = styled.div`
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;

const StatusIndicator = styled.div<{ type: 'info' | 'success' }>`
  background: ${props => props.type === 'success' ? '#d4edda' : '#d1ecf1'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#bee5eb'};
  color: ${props => props.type === 'success' ? '#155724' : '#0c5460'};
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectInputPanel: React.FC<ProjectInputPanelProps> = ({
  onProjectDetailsChange,
  onProjectDetailsBlur,
  projectDetails
}) => {
  return (
    <Panel>
      <Title>🏢 Azure Customer Project Details</Title>
      <TextArea
        value={projectDetails}
        onChange={(e) => onProjectDetailsChange(e.target.value)}
        onBlur={(e) => {
          console.log('DEBUG: TextArea onBlur triggered with value length:', e.target.value.length);
          onProjectDetailsBlur?.(e.target.value);
        }}
        placeholder="Provide comprehensive details about the customer's Azure project scenario and requirements...

Include information such as:

🏢 CUSTOMER CONTEXT:
• Company size and industry
• Current technology stack
• Existing Azure resources (if any)
• Geographic locations and compliance requirements

📋 PROJECT SCENARIO:
• Business objectives and goals
• Current challenges or pain points
• Timeline and budget considerations
• Key stakeholders and decision makers

🎯 TECHNICAL REQUIREMENTS:
• Performance and scalability needs
• Security and compliance requirements
• Integration requirements with existing systems
• Data storage and processing needs
• High availability and disaster recovery requirements

🔧 SPECIFIC CONSTRAINTS:
• Budget limitations
• Technical constraints
• Organizational policies
• Regulatory compliance needs
• Preferred Azure services or regions

💼 SUCCESS CRITERIA:
• How will success be measured?
• Key performance indicators
• User experience expectations
• Business impact goals

The more detailed information you provide, the better I can recommend appropriate Azure solutions and architecture patterns for your customer's specific needs."
      />
      
      <CharacterCount>
        {projectDetails.length} characters
      </CharacterCount>
      
      {projectDetails.length > 0 && (
        <StatusIndicator type="success">
          <span>✅ Project details ready for Azure solution analysis</span>
        </StatusIndicator>
      )}
      
      {projectDetails.length > 500 && (
        <StatusIndicator type="info">
          <span>💡 Excellent detail level! I can provide comprehensive Azure architecture recommendations.</span>
        </StatusIndicator>
      )}
    </Panel>
  );
};