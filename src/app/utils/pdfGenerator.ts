import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

export const generateTaxReportPDF = async (reportData: any) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // 한글 폰트 설정 (기본 폰트 사용)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('종합소득세 신고 자료', margin, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, margin, yPosition);

  yPosition += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('수입 내역', margin, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`월세 수입: ${reportData.rentalIncome?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.text(`관리비 수입: ${reportData.maintenanceIncome?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`총 수입: ${reportData.totalIncome?.toLocaleString() || '0'} 원`, margin + 5, yPosition);

  yPosition += 15;
  pdf.setFontSize(14);
  pdf.text('필요경비 내역', margin, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`관리비 지출: ${reportData.maintenanceExpenses?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.text(`수리비: ${reportData.repairCosts?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.text(`재산세: ${reportData.propertyTax?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.text(`대출 이자: ${reportData.loanInterest?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`총 필요경비: ${reportData.totalExpenses?.toLocaleString() || '0'} 원`, margin + 5, yPosition);

  yPosition += 15;
  pdf.setFontSize(14);
  pdf.text('과세표준 및 세액', margin, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`과세표준: ${reportData.taxableIncome?.toLocaleString() || '0'} 원`, margin + 5, yPosition);
  
  yPosition += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text(`예상 세액: ${reportData.estimatedTax?.toLocaleString() || '0'} 원`, margin + 5, yPosition);

  pdf.save(`세금리포트_${new Date().toISOString().split('T')[0]}.pdf`);
};
