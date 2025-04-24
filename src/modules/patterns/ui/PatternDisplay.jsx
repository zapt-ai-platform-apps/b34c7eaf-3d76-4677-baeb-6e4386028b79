import React from 'react';
import { jsPDF } from 'jspdf';

const PatternDisplay = ({ generation }) => {
  if (!generation) {
    return null;
  }
  
  const { pattern, customer, measurements } = generation;
  
  const downloadPDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`${pattern.name} Pattern`, 105, 20, { align: 'center' });
    
    // Add customer info
    doc.setFontSize(14);
    doc.text(`Pattern for: ${customer.name}`, 20, 40);
    
    // Add measurements
    doc.setFontSize(12);
    doc.text('Measurements:', 20, 50);
    doc.text(`Chest: ${measurements.chest} cm`, 30, 60);
    doc.text(`Waist: ${measurements.waist} cm`, 30, 70);
    doc.text(`Hip: ${measurements.hip} cm`, 30, 80);
    
    if (measurements.neck) doc.text(`Neck: ${measurements.neck} cm`, 30, 90);
    if (measurements.shoulder) doc.text(`Shoulder: ${measurements.shoulder} cm`, 30, 100);
    if (measurements.armLength) doc.text(`Arm Length: ${measurements.armLength} cm`, 30, 110);
    if (measurements.inseam) doc.text(`Inseam: ${measurements.inseam} cm`, 30, 120);
    if (measurements.height) doc.text(`Height: ${measurements.height} cm`, 30, 130);
    
    // Add pattern instructions
    doc.setFontSize(14);
    doc.text('Instructions:', 20, 150);
    doc.setFontSize(10);
    doc.text('1. Print this pattern at 100% scale (no shrinking to fit).', 30, 160);
    doc.text('2. Cut out the pattern pieces along the solid lines.', 30, 170);
    doc.text('3. Pin pattern to fabric and cut according to the layout diagram.', 30, 180);
    doc.text('4. Follow the sewing instructions included with your pattern.', 30, 190);
    
    // Save the PDF
    doc.save(`${pattern.name.toLowerCase().replace(/\s+/g, '_')}_pattern.pdf`);
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Pattern Generated!</h2>
      
      <div className="bg-indigo-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-lg mb-2">{pattern.name}</h3>
        <p className="text-gray-600 mb-2">{pattern.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <h4 className="font-medium">Customer</h4>
            <p className="text-sm">{customer.name}</p>
          </div>
          <div>
            <h4 className="font-medium">Pattern Type</h4>
            <p className="text-sm capitalize">{pattern.type}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-1">Measurements Used</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>Chest: {measurements.chest} cm</div>
            <div>Waist: {measurements.waist} cm</div>
            <div>Hip: {measurements.hip} cm</div>
            {measurements.neck && <div>Neck: {measurements.neck} cm</div>}
            {measurements.shoulder && <div>Shoulder: {measurements.shoulder} cm</div>}
            {measurements.armLength && <div>Arm Length: {measurements.armLength} cm</div>}
            {measurements.inseam && <div>Inseam: {measurements.inseam} cm</div>}
            {measurements.height && <div>Height: {measurements.height} cm</div>}
          </div>
        </div>
      </div>
      
      <div className="pattern-diagram p-4 border rounded-lg mb-4 flex justify-center">
        {pattern.type === 'top' ? (
          <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <g stroke="black" fill="none">
              <path d="M100,20 L200,20 L220,60 L220,150 L200,180 L100,180 L80,150 L80,60 Z" strokeWidth="2" />
              <path d="M100,20 L100,180" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M200,20 L200,180" strokeWidth="1" strokeDasharray="5,5" />
              <path d="M150,20 L150,80" strokeWidth="1" />
              <ellipse cx="150" cy="20" rx="50" ry="10" strokeWidth="1" />
              <path d="M80,60 L60,100" strokeWidth="2" />
              <path d="M60,100 L80,100" strokeWidth="2" />
              <path d="M220,60 L240,100" strokeWidth="2" />
              <path d="M240,100 L220,100" strokeWidth="2" />
            </g>
          </svg>
        ) : (
          <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <g stroke="black" fill="none">
              <path d="M100,20 L200,20 L210,180 L90,180 Z" strokeWidth="2" />
              <path d="M150,20 L150,180" strokeWidth="1" strokeDasharray="5,5" />
              <ellipse cx="150" cy="20" rx="50" ry="10" strokeWidth="1" />
              <path d="M100,20 C80,50 80,100 90,180" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M200,20 C220,50 220,100 210,180" strokeWidth="1" strokeDasharray="3,3" />
            </g>
          </svg>
        )}
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={downloadPDF}
          className="btn-primary cursor-pointer flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF Pattern
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: This is a simplified demonstration. In a production app, the pattern would include properly scaled pattern pieces and detailed sewing instructions.</p>
      </div>
    </div>
  );
};

export default PatternDisplay;