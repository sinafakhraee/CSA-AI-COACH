import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker to use the local file (matches version 3.11.174)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface JobSetupPanelProps {
  onResumeUpload: (resumeText: string, fileName: string) => void;
  onJobDescriptionChange: (jobDescription: string) => void;
  resumeText: string;
  jobDescription: string;
}

const Panel = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '💼';
    margin-right: 10px;
    font-size: 1.2em;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  color: #555;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }
`;

const FileUploadArea = styled.div<{ isDragOver: boolean; hasFile: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#667eea' : props.hasFile ? '#28a745' : '#ccc'};
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragOver ? 'rgba(102, 126, 234, 0.05)' : props.hasFile ? 'rgba(40, 167, 69, 0.05)' : '#f8f9fa'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: ${props => props.hasFile ? '#28a745' : '#667eea'};
    background: ${props => props.hasFile ? 'rgba(40, 167, 69, 0.08)' : 'rgba(102, 126, 234, 0.08)'};
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const UploadIcon = styled.div<{ hasFile: boolean }>`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.hasFile ? '#28a745' : '#667eea'};

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }
`;

const UploadText = styled.div`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;

  .primary {
    color: #333;
    font-weight: 500;
  }

  .secondary {
    font-size: 0.9rem;
    color: #999;
    margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  max-height: 400px;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  background: #fafbfc;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #adb5bd;
  }

  @media (max-width: 768px) {
    min-height: 150px;
    font-size: 0.9rem;
    padding: 0.8rem;
  }
`;

const StatusIndicator = styled.div<{ type: 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  background: ${props => props.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.type === 'success' ? '#155724' : '#0c63e4'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
`;

const ClearButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

export const JobSetupPanel: React.FC<JobSetupPanelProps> = ({
  onResumeUpload,
  onJobDescriptionChange,
  resumeText,
  jobDescription
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      // Handle TXT files
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedFileName(file.name);
        onResumeUpload(text, file.name);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // Handle PDF files with better error handling
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Initialize PDF.js with the arrayBuffer
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .filter((item: any) => item.str)
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        if (fullText.trim()) {
          setUploadedFileName(file.name);
          onResumeUpload(fullText.trim(), file.name);
        } else {
          alert('No text content found in the PDF. Please try a different file or convert it to .txt format.');
        }
      } catch (error) {
        console.error('Error reading PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`PDF processing temporarily unavailable: ${errorMessage}. Please use a .txt file instead.`);
      }
    } else {
      alert('Please upload a .txt or .pdf file containing your resume.');
    }
  }, [onResumeUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const clearResume = useCallback(() => {
    setUploadedFileName('');
    onResumeUpload('', '');
  }, [onResumeUpload]);

  const hasResume = resumeText.length > 0;

  return (
    <Panel>
      <Title>Job Interview Preparation</Title>
      
      <Section>
        <SectionTitle>📄 Your Resume</SectionTitle>
        <FileUploadArea
          isDragOver={isDragOver}
          hasFile={hasResume}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HiddenInput
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileInput}
          />
          <UploadIcon hasFile={hasResume}>
            {hasResume ? '✅' : '📎'}
          </UploadIcon>
          <UploadText>
            {hasResume ? (
              <>
                <div className="primary">Resume uploaded successfully!</div>
                <div className="secondary">File: {uploadedFileName}</div>
              </>
            ) : (
              <>
                <div className="primary">
                  Drag & drop your resume here, or click to browse
                </div>
                <div className="secondary">
                  Supported formats: .txt and .pdf files
                </div>
              </>
            )}
          </UploadText>
        </FileUploadArea>
        
        {hasResume && (
          <StatusIndicator type="success">
            <span>📊 Resume loaded ({resumeText.length} characters)</span>
            <ClearButton onClick={clearResume}>Clear</ClearButton>
          </StatusIndicator>
        )}
      </Section>

      <Section>
        <SectionTitle>💼 Job Description</SectionTitle>
        <TextArea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here...

Include details like:
• Job title and company
• Required skills and qualifications
• Job responsibilities
• Years of experience needed
• Preferred technologies or tools

The AI coach will use this information to provide targeted interview preparation and ask relevant questions based on the role."
        />
        
        {jobDescription.length > 0 && (
          <StatusIndicator type="info">
            <span>📝 Job description ready ({jobDescription.length} characters)</span>
          </StatusIndicator>
        )}
      </Section>
    </Panel>
  );
};
