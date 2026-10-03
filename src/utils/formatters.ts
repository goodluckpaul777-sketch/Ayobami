import { FabricProduct, InquiryItem, CustomerInquiryInfo } from '../types';

/**
 * Format any number as Nigerian Naira currency (if needed)
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  const formatted = Math.round(amount).toLocaleString('en-NG');
  return `₦${formatted}`;
}

/**
 * Clean phone number for WhatsApp international standard format (234...)
 */
export function cleanNigerianPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.slice(1);
  } else if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned;
  }
  return cleaned;
}

/**
 * Generate a pre-filled WhatsApp inquiry link for a single item (No Price Tag)
 */
export function generateWhatsAppProductLink(
  phone: string,
  product: FabricProduct,
  quantity: number,
  selectedColor?: string,
  customerName?: string,
  location?: string,
  storeName: string = 'Ayobami SAM Ventures'
): string {
  const targetPhone = cleanNigerianPhone(phone);
  const unit = product.unitLabel || (quantity === 1 ? 'Unit' : 'Units');
  const section = product.mainSection === 'cloths' ? 'Cloths' : product.mainSection === 'shoes' ? 'Shoes' : 'Tailoring Machine';
  
  const text = `Hello ${storeName}, I want to inquire about this product:

📌 *Item:* ${product.name}
📂 *Section:* ${section} (${product.category})
🧵 *Material/Spec:* ${product.fabricType}
🔢 *Quantity:* ${quantity} ${unit}
${selectedColor ? `🎨 *Option / Colour:* ${selectedColor}\n` : ''}${customerName ? `👤 *Customer Name:* ${customerName}\n` : ''}${location ? `📍 *Delivery Location:* ${location}\n` : ''}
Please let me know the current price quotation, pictures, and delivery timeline. Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a pre-filled WhatsApp inquiry link for multiple items
 */
export function generateWhatsAppCartLink(
  phone: string,
  items: InquiryItem[],
  customer?: CustomerInquiryInfo,
  storeName: string = 'Ayobami SAM Ventures'
): string {
  const targetPhone = cleanNigerianPhone(phone);
  
  let itemLines = items.map((item, index) => {
    const unit = item.product.unitLabel || (item.quantity === 1 ? 'Unit' : 'Units');
    return `${index + 1}. *${item.product.name}*
   - Quantity: ${item.quantity} ${unit} (${item.product.category})${item.selectedColor ? ` [${item.selectedColor}]` : ''}`;
  }).join('\n\n');

  let text = `Hello ${storeName}, I would like to request price quotations for these items:

📦 *INQUIRY LIST:*
${itemLines}`;

  if (customer && customer.fullName) {
    text += `\n\n👤 *CUSTOMER DETAILS:*
- Name: ${customer.fullName}
- Phone: ${customer.phone}
- State: ${customer.state}
- City: ${customer.city}
${customer.notes ? `- Note: ${customer.notes}\n` : ''}`;
  }

  text += `\n\nPlease send me prices and payment/delivery details. Thank you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
