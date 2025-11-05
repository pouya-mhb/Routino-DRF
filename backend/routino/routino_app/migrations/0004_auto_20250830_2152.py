from django.db import migrations

def create_initial_data(apps, schema_editor):
    Category = apps.get_model('routino_app', 'Category')
    SubCategory = apps.get_model('routino_app', 'SubCategory')
    Frequency = apps.get_model('routino_app', 'Frequency')
    Status = apps.get_model('routino_app', 'Status')

    # دسته‌بندی‌ها
    categories_data = [
        {'title': 'شخصی', 'description': 'فعالیت‌ها و روتین‌های مربوط به زندگی شخصی و بهبود فردی', 'score': 1},
        {'title': 'کاری', 'description': 'فعالیت‌ها و وظایف مرتبط با شغل و حرفه', 'score': 1},
        {'title': 'ورزشی', 'description': 'فعالیت‌های مرتبط با تناسب اندام و سلامتی جسمانی', 'score': 1},
        {'title': 'آموزشی', 'description': 'فعالیت‌های مرتبط با یادگیری و توسعه مهارت‌ها', 'score': 1},
        {'title': 'مالی', 'description': 'فعالیت‌های مرتبط با مدیریت مالی و بودجه‌بندی', 'score': 1},
        {'title': 'اجتماعی', 'description': 'فعالیت‌های مرتبط با ارتباطات و تعاملات اجتماعی', 'score': 1},
    ]

    categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            title=cat_data['title'],
            defaults={'description': cat_data['description'], 'score': cat_data['score']}
        )
        categories[cat_data['title']] = category

    # زیرمجموعه‌ها
    subcategories_data = [
        {'title': 'مراقبت از خود', 'description': 'فعالیت‌هایی مثل مدیتیشن، مراقبه یا مراقبت‌های روزانه', 'score': 1, 'category_title': 'شخصی'},
        {'title': 'سرگرمی', 'description': 'فعالیت‌های تفریحی مثل نقاشی، نواختن موسیقی یا مطالعه', 'score': 1, 'category_title': 'شخصی'},
        {'title': 'مدیریت زمان', 'description': 'برنامه‌ریزی روزانه، اولویت‌بندی وظایف یا سازماندهی', 'score': 1, 'category_title': 'شخصی'},
        {'title': 'پروژه‌های کاری', 'description': 'وظایف مرتبط با پروژه‌های شغلی یا تسک‌های تیمی', 'score': 1, 'category_title': 'کاری'},
        {'title': 'جلسات', 'description': 'برنامه‌ریزی و شرکت در جلسات کاری یا ارائه‌ها', 'score': 1, 'category_title': 'کاری'},
        {'title': 'توسعه حرفه‌ای', 'description': 'یادگیری مهارت‌های جدید مرتبط با شغل', 'score': 1, 'category_title': 'کاری'},
        {'title': 'تمرینات هوازی', 'description': 'فعالیت‌هایی مثل دویدن، دوچرخه‌سواری یا شنا', 'score': 1, 'category_title': 'ورزشی'},
        {'title': 'تمرینات قدرتی', 'description': 'فعالیت‌هایی مثل بدنسازی یا تمرین با وزنه', 'score': 1, 'category_title': 'ورزشی'},
        {'title': 'یوگا و انعطاف‌پذیری', 'description': 'تمرینات یوگا، پیلاتس یا کشش عضلانی', 'score': 1, 'category_title': 'ورزشی'},
        {'title': 'مطالعه', 'description': 'مطالعه کتاب، مقاله یا منابع آموزشی', 'score': 1, 'category_title': 'آموزشی'},
        {'title': 'دوره‌های آنلاین', 'description': 'شرکت در دوره‌های آموزشی آنلاین یا وبینارها', 'score': 1, 'category_title': 'آموزشی'},
        {'title': 'پروژه‌های یادگیری', 'description': 'انجام پروژه‌های عملی برای یادگیری مهارت جدید', 'score': 1, 'category_title': 'آموزشی'},
        {'title': 'بودجه‌بندی', 'description': 'برنامه‌ریزی برای هزینه‌ها و پس‌انداز', 'score': 1, 'category_title': 'مالی'},
        {'title': 'سرمایه‌گذاری', 'description': 'فعالیت‌های مرتبط با سرمایه‌گذاری یا مدیریت دارایی', 'score': 1, 'category_title': 'مالی'},
        {'title': 'پرداخت قبوض', 'description': 'مدیریت پرداخت‌های منظم مثل قبوض و صورت‌حساب‌ها', 'score': 1, 'category_title': 'مالی'},
        {'title': 'ملاقات با دوستان', 'description': 'برنامه‌ریزی برای دیدار با دوستان یا خانواده', 'score': 1, 'category_title': 'اجتماعی'},
        {'title': 'فعالیت‌های گروهی', 'description': 'شرکت در رویدادهای گروهی یا فعالیت‌های تیمی', 'score': 1, 'category_title': 'اجتماعی'},
        {'title': 'شبکه‌سازی', 'description': 'گسترش ارتباطات حرفه‌ای یا اجتماعی', 'score': 1, 'category_title': 'اجتماعی'},
    ]

    for sub_data in subcategories_data:
        SubCategory.objects.get_or_create(
            title=sub_data['title'],
            defaults={
                'description': sub_data['description'],
                'score': sub_data['score'],
                'category': categories[sub_data['category_title']],
            }
        )

    # فرکانس‌ها
    frequencies = [
        {'title': 'روزانه', 'description': 'فعالیت‌هایی که روزانه انجام می‌شوند', 'score': 1},
        {'title': 'هفتگی', 'description': 'فعالیت‌هایی که هفتگی انجام می‌شوند', 'score': 1},
        {'title': 'ماهانه', 'description': 'فعالیت‌هایی که ماهانه انجام می‌شوند', 'score': 1},
    ]
    for freq in frequencies:
        Frequency.objects.get_or_create(title=freq['title'], defaults=freq)

    # وضعیت‌ها
    statuses = [
        {'title': 'To Do', 'description': 'وظایف در انتظار انجام', 'score': 0},
        {'title': 'Doing', 'description': 'وظایف در حال انجام', 'score': 5},
        {'title': 'Done', 'description': 'وظایف تکمیل‌شده', 'score': 10},
    ]
    for status in statuses:
        Status.objects.get_or_create(title=status['title'], defaults=status)

class Migration(migrations.Migration):
    dependencies = [
        ('routino_app', '0003_auto_20250830_2106'),
    ]

    operations = [
        migrations.RunPython(create_initial_data),
    ]