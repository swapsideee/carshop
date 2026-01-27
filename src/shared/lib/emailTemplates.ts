export type EmailCartItem = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderEmailBody = {
  name?: string;
  phone?: string;
  email?: string;
  comment?: string;
  cartItems?: EmailCartItem[];
  total?: number;
};

export function generateOwnerEmailHtml(body: OrderEmailBody): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2>🛒 Деталі замовлення</h2>
        <p><strong>Ім'я:</strong> ${body.name || '-'}</p>
        <p><strong>Телефон:</strong> ${body.phone || '-'}</p>
        <p><strong>Email:</strong> ${body.email || '-'}</p>
        <p><strong>Коментар:</strong> ${body.comment || '-'}</p>

        <h3>🧾 Замовлені товари:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th align="left">Товар</th>
              <th align="center">Кількість</th>
              <th align="right">Ціна</th>
            </tr>
          </thead>
          <tbody>
            ${
              body.cartItems
                ?.map(
                  (item) => `
              <tr>
                <td>${item.name}</td>
                <td align="center">${item.quantity}</td>
                <td align="right">${item.price * item.quantity} грн</td>
              </tr>
            `,
                )
                .join('') ?? ''
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" align="right"><strong>Всього:</strong></td>
              <td align="right"><strong>${body.total || 0} грн</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

export function generateClientEmailHtml(body: OrderEmailBody): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2>🛒 Ваше замовлення прийнято</h2>
        <p><strong>Ім'я:</strong> ${body.name || '-'}</p>
        <p><strong>Телефон:</strong> ${body.phone || '-'}</p>
        <p><strong>Коментар:</strong> ${body.comment || '-'}</p>

        <h3>🧾 Замовлені товари:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th align="left">Товар</th>
              <th align="center">Кількість</th>
              <th align="right">Ціна</th>
            </tr>
          </thead>
          <tbody>
            ${
              body.cartItems
                ?.map(
                  (item) => `
              <tr>
                <td>${item.name}</td>
                <td align="center">${item.quantity}</td>
                <td align="right">${item.price * item.quantity} грн</td>
              </tr>
            `,
                )
                .join('') ?? ''
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" align="right"><strong>Всього:</strong></td>
              <td align="right"><strong>${body.total || 0} грн</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px;">
          <h3>📍 Контактна інформація</h3>
          <p> 📞 <a href="tel:+3801234567899">+38 0123 456 7899</a></p>
          <p> 📍 вул. Приблизна, 10</p>
          <p> 📌 Харків</p>
          <p> 🕐 Пн–Нд, 9:00–13:00</p>
        </div>

        <p style="font-size: 12px; color: #888;">Це повідомлення сформоване автоматично.Очікуйте на повідомлення від менеджера.Дякуємо за замовлення!</p>
      </div>
    </div>
  `;
}
