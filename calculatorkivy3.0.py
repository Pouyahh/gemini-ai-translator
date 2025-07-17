# -*- coding: utf-8 -*-
import kivy
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.core.window import Window
from kivy.utils import get_color_from_hex
import re # اضافه شدن برای تجزیه عبارت ریاضی
from kivy.graphics import Color, Rectangle, RoundedRectangle # وارد کردن کلاس‌های گرافیکی

# تنظیمات Kivy برای اطمینان از سازگاری
kivy.require('2.0.0') # اطمینان از اینکه نسخه Kivy حداقل 2.0.0 است

class CalculatorApp(App):
    def build(self):
        # تنظیم اندازه اولیه پنجره و قابلیت تغییر اندازه
        # Set initial window size and make it resizable
        Window.size = (320, 520)
        # Window.resizable = True # Kivy windows are resizable by default on desktop

        # متغیر برای نگهداری عبارت و پرچم نمایش نتیجه
        # Variable to hold the expression and result display flag
        self.expression = ""
        self.result_displayed = False

        # چیدمان اصلی عمودی
        # Main vertical layout
        # پدینگ اصلی برای چیدمان ماشین حساب
        # Main padding for the calculator layout
        main_layout = BoxLayout(orientation='vertical', padding=11, spacing=10)
        
        # اعمال پس‌زمینه به canvas.before چیدمان اصلی با رنگ مدرن‌تر
        # Apply background to main_layout's canvas.before with a more modern color
        with main_layout.canvas.before:
            Color(*get_color_from_hex("#1a1a1a")) # رنگ پس‌زمینه تیره‌تر و مدرن‌تر
            self.main_layout_rect = Rectangle(pos=main_layout.pos, size=main_layout.size)
        main_layout.bind(pos=self._update_main_layout_rect, size=self._update_main_layout_rect)

        # برچسب نمایشگر
        # Display label
        self.display_label = Label(
            text="0",
            font_size=48,
            halign='right', # تراز افقی به راست
            valign='middle', # تراز عمودی به وسط
            size_hint_y=None, # ارتفاع ثابت
            height=100,
            color=get_color_from_hex("#FFFFFF") # رنگ متن سفید
        )
        # اضافه کردن پس‌زمینه نمایشگر به canvas.before با رنگ مدرن‌تر
        # Add display background to canvas.before with a more modern color
        with self.display_label.canvas.before:
            Color(*get_color_from_hex("#0d0d0d")) # رنگ پس‌زمینه نمایشگر تیره‌تر برای کنتراست
            self.display_rect = Rectangle(pos=self.display_label.pos, size=self.display_label.size)
        
        # اتصال برای به‌روزرسانی پس‌زمینه نمایشگر هنگام تغییر اندازه
        # Bind to update display background when resized
        self.display_label.bind(size=self._update_display_rect, pos=self._update_display_rect)
        main_layout.add_widget(self.display_label)

        # چیدمان شبکه‌ای برای دکمه‌ها
        # Grid layout for buttons
        buttons_layout = GridLayout(cols=4, spacing=10)

        # داده‌های دکمه‌ها (متن و نوع برای استایل‌دهی)
        # Button data (text and type for styling)
        # 'num': عدد, 'op': عملگر, 'special': AC, +/-, %
        button_data = [
            ('AC', 'special'), ('+/-', 'special'), ('%', 'special'), ('÷', 'op'),
            ('7', 'num'), ('8', 'num'), ('9', 'num'), ('×', 'op'),
            ('4', 'num'), ('5', 'num'), ('6', 'num'), ('-', 'op'),
            ('1', 'num'), ('2', 'num'), ('3', 'num'), ('+', 'op'),
            ('0', 'num'), ('.', 'num'), ('=', 'op')
        ]

        # ایجاد و افزودن دکمه‌ها
        # Create and add buttons
        for text, btn_type in button_data:
            button = Button(
                text=text,
                font_size=28,
                size_hint=(None, None), # اندازه ثابت
                size=(70, 70) # اندازه ثابت برای مربع کردن دکمه‌ها
            )

            # تعیین رنگ پس‌زمینه برای دستورات گرافیکی با رنگ‌های مدرن‌تر
            # Determine background color for graphics instructions with more modern colors
            bg_color_hex = "#2e2e2e" # رنگ تیره‌تر برای اعداد
            if btn_type == 'op':
                bg_color_hex = "#ff6600" # نارنجی زنده‌تر
            elif btn_type == 'special':
                bg_color_hex = "#6a6a6a" # خاکستری تیره‌تر و یکپارچه‌تر
            
            # افزودن دستورات گرافیکی یک بار و ذخیره مرجع
            # Add graphics instructions once and store reference
            with button.canvas.before:
                Color(*get_color_from_hex(bg_color_hex))
                # تنظیم radius برای گوشه‌های گرد (نه کاملاً دایره‌ای)
                # Set radius for rounded corners (not perfectly circular)
                button._rounded_rect = RoundedRectangle(pos=button.pos, size=button.size, radius=[15, 15, 15, 15])

            # تنظیم پس‌زمینه و رنگ متن داخلی Kivy (برای سازگاری بصری)
            # Set Kivy's internal background_normal/color (for visual consistency)
            button.background_normal = '' 
            button.background_color = get_color_from_hex(bg_color_hex) 

            # تنظیم رنگ متن دکمه
            # Set button text color
            if btn_type == 'special':
                button.color = get_color_from_hex("#000000")
            else:
                button.color = get_color_from_hex("#FFFFFF")
            
            # اتصال برای به‌روزرسانی شکل دکمه هنگام تغییر اندازه
            # Bind to update button shape when resized
            button.bind(size=self._update_button_shape, pos=self._update_button_shape)
            
            # اتصال کلیک دکمه به هندلر
            # Connect button click to handler
            button.bind(on_press=self.on_button_click)

            # مدیریت دکمه '0' که دو ستون را اشغال می‌کند
            # Handle '0' button spanning two columns
            if text == '0':
                buttons_layout.add_widget(button)
                # افزودن یک ویجت خالی برای پر کردن فضای اضافی
                # Add an empty widget to fill the extra space
                buttons_layout.add_widget(Label()) 
            else:
                buttons_layout.add_widget(button)
        
        main_layout.add_widget(buttons_layout)
        return main_layout

    # متد برای به‌روزرسانی مستطیل پس‌زمینه چیدمان اصلی
    # Method to update the main layout's background rectangle
    def _update_main_layout_rect(self, instance, value):
        self.main_layout_rect.pos = instance.pos
        self.main_layout_rect.size = instance.size

    # متد برای به‌روزرسانی مستطیل پس‌زمینه نمایشگر
    # Method to update the display label's background rectangle
    def _update_display_rect(self, instance, value):
        # به‌روزرسانی موقعیت و اندازه مستطیل
        # Update the position and size of the rectangle
        self.display_rect.pos = instance.pos
        self.display_rect.size = instance.size

    # متد برای به‌روزرسانی شکل دکمه‌ها به گرد
    # Method to update button shapes to rounded
    def _update_button_shape(self, instance, value):
        # فقط موقعیت و اندازه RoundedRectangle موجود را به‌روزرسانی کنید
        # Only update the position and size of the *existing* RoundedRectangle
        if hasattr(instance, '_rounded_rect'): # بررسی کنید که دستور گرافیکی وجود دارد
            instance._rounded_rect.pos = instance.pos
            instance._rounded_rect.size = instance.size
            # شعاع را ثابت نگه دارید تا گوشه‌ها گرد بمانند اما دکمه مربع باشد
            # Keep radius fixed to maintain rounded corners but square button
            instance._rounded_rect.radius = [15, 15, 15, 15]


    def on_button_click(self, instance):
        text = instance.text
        if text == 'AC':
            self.expression = ""
            self.display_label.text = "0"
            self.result_displayed = False
        elif text == '=':
            self.calculate_result()
        elif text == '+/-':
            self.toggle_sign()
        elif text == '%':
            self.calculate_percentage()
        else:
            if self.result_displayed and text not in ['+', '-', '×', '÷']:
                # اگر نتیجه‌ای نمایش داده شده بود و یک عدد جدید فشار داده شد، از نو شروع کن
                # If a result was just displayed and a new number is pressed, start fresh
                self.expression = text
                self.result_displayed = False
            elif self.expression == "0" and text != ".":
                # مدیریت نمایش "0" اولیه
                # Handle initial "0" display
                self.expression = text
            elif text in ['+', '-', '×', '÷'] and self.expression and self.expression[-1] in ['+', '-', '×', '÷']:
                # جایگزینی آخرین عملگر اگر یک عملگر جدید فشار داده شود
                # Replace last operator if a new one is pressed
                self.expression = self.expression[:-1] + text
            elif text == '.' and self.expression and self.expression[-1] == '.':
                # جلوگیری از چندین اعشار اگر آخرین کاراکتر اعشار است
                # Prevent multiple decimals if last char is already a decimal
                pass
            elif text == '.' and not self.expression:
                # شروع با "0." اگر اعشار ابتدا فشار داده شود
                # Start with "0." if decimal is pressed first
                self.expression = "0."
            elif text == '.' and self.expression and self.expression[-1] in ['+', '-', '×', '÷']:
                # اضافه کردن "0." پس از عملگر اگر اعشار فشار داده شود
                # Add "0." after an operator if decimal is pressed
                self.expression += "0."
            else:
                self.expression += text
            self.display_label.text = self.expression

    def calculate_result(self):
        try:
            # جایگزینی نمادهای نمایشگر با عملگرهای پایتون
            # Replace display symbols with Python operators
            expression_to_eval = self.expression.replace('×', '*').replace('÷', '/')
            
            if not expression_to_eval:
                self.display_label.text = "0"
                return

            # استفاده از تابع ارزیابی ایمن سفارشی
            # Use custom safe evaluation function
            result = self._safe_evaluate_expression(expression_to_eval)
            
            # فرمت‌بندی نتیجه برای جلوگیری از اعشار طولانی برای اعداد صحیح
            # Format result to avoid long decimals for integers
            if result == int(result):
                result = int(result)
            self.display_label.text = str(result)
            self.expression = str(result) # تنظیم عبارت فعلی به نتیجه برای عملیات زنجیره‌ای
            self.result_displayed = True
        except ZeroDivisionError:
            self.display_label.text = "Error"
            self.expression = ""
            self.result_displayed = True
        except Exception as e:
            # گرفتن سایر خطاهای احتمالی در حین تجزیه/محاسبه
            # Catch other potential errors during parsing/calculation
            self.display_label.text = "Error"
            self.expression = ""
            self.result_displayed = True

    def _safe_evaluate_expression(self, expression_str):
        # تجزیه عبارت: اعداد و عملگرها (+, -, *, /)
        # Tokenize the expression: numbers and operators (+, -, *, /)
        # این regex اعداد (صحیح و اعشاری) و عملگرها را مدیریت می‌کند.
        # This regex handles numbers (integers and floats) and operators.
        # همچنین به طور ضمنی علامت‌های منفی ابتدایی را با در نظر گرفتن آن‌ها به عنوان بخشی از عدد اول مدیریت می‌کند.
        # It also implicitly handles leading signs by treating them as part of the first number.
        # به عنوان مثال، "-5+2" به صورت ["-5", "+", "2"] تجزیه خواهد شد.
        # For example, "-5+2" will be tokenized as ["-5", "+", "2"].
        # این فرض می‌کند که ورودی از دکمه‌های ماشین حساب یک توالی معتبر را می‌سازد.
        # This assumes the input from the calculator buttons builds a valid sequence.
        tokens = re.findall(r'(\d+\.?\d*|\+|\-|\*|\/)', expression_str)

        # مدیریت علامت منفی ابتدایی در صورت وجود (مانند "-5+2")
        # Handle leading negative sign if present (e.g., "-5+2")
        if tokens and tokens[0] == '-' and len(tokens) > 1 and re.match(r'\d+\.?\d*', tokens[1]):
            tokens[0:2] = [f"-{tokens[1]}"]

        # مرحله اول: مدیریت ضرب و تقسیم
        # First pass: handle multiplication and division
        temp_tokens = []
        i = 0
        while i < len(tokens):
            if tokens[i] == '*':
                # انجام ضرب
                # Perform multiplication
                val = float(temp_tokens.pop()) * float(tokens[i+1])
                temp_tokens.append(str(val))
                i += 2
            elif tokens[i] == '/':
                # انجام تقسیم
                # Perform division
                divisor = float(tokens[i+1])
                if divisor == 0:
                    raise ZeroDivisionError("Division by zero")
                val = float(temp_tokens.pop()) / divisor
                temp_tokens.append(str(val))
                i += 2
            else:
                temp_tokens.append(tokens[i])
                i += 1
        tokens = temp_tokens

        # مرحله دوم: مدیریت جمع و تفریق
        # Second pass: handle addition and subtraction
        if not tokens:
            return 0.0
        
        result = float(tokens[0])
        i = 1
        while i < len(tokens):
            op = tokens[i]
            num = float(tokens[i+1])
            if op == '+':
                result += num
            elif op == '-':
                result -= num
            i += 2
        return result

if __name__ == '__main__':
    CalculatorApp().run()
