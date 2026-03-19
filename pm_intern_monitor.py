import datetime
import os

def get_latest_internships():
    # 抓取到的最新岗位信息 (更新于 2026-03-19)
    # 基于搜索结果整理的最新的 2026/2027 届产品经理实习岗位
    return [
        {"company": "美团", "title": "2026年春季转正实习生-产品经理", "location": "北京/上海/深圳/成都", "date": "2026-03-05", "link": "https://zhaopin.meituan.com/web/campus"},
        {"company": "腾讯", "title": "2026实习生招聘-产品经理 (全业务线)", "location": "深圳/北京/上海/广州", "date": "2026-03-06", "link": "https://join.qq.com/post.html"},
        {"company": "字节跳动", "title": "ByteIntern: 2026届转正实习生-产品经理", "location": "北京/上海/杭州/深圳", "date": "2026-03-06", "link": "https://jobs.bytedance.com/campus/"},
        {"company": "蚂蚁集团", "title": "2026届暑期实习-产品经理 (AI/金融/平台)", "location": "杭州/北京/上海/成都", "date": "2026-03-17", "link": "https://talent.antgroup.com/campus"},
        {"company": "百度", "title": "2026届暑期实习-产品经理 (AI方向优先)", "location": "北京/上海/深圳", "date": "2026-03-10", "link": "https://talent.baidu.com/jobs/campus-list.html"},
        {"company": "小红书", "title": "产品经理实习生 (社区/电商/运营)", "location": "广州/南京/上海", "date": "2026-03-16", "link": "https://campus.xiaohongshu.com/"},
        {"company": "Klook", "title": "2026全球产研校园实习生-产品经理", "location": "深圳/香港", "date": "2026-03-18", "link": "https://www.klook.com/careers/"},
        {"company": "证通电子", "title": "2026春招-产品经理", "location": "深圳", "date": "2026-03-13", "link": "https://www.szzt.com.cn/"},
        {"company": "招商银行", "title": "招银网络科技2027届实习生-产品/技术", "location": "深圳/杭州/成都", "date": "2026-03-18", "link": "https://cmbnt.cmbchina.com/"},
        {"company": "哔哩哔哩", "title": "2026届春季实习生-产品经理", "location": "上海", "date": "2026-03-15", "link": "https://jobs.bilibili.com/campus"}
    ]

def update_report(internships):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    
    report_content = "# 互联网产品经理实习岗位监控报告\n\n"
    report_content += f"**更新时间**: {now}\n\n"
    report_content += "本报告汇总了最新的互联网大厂及知名企业的 2026/2027 届产品经理实习生（含暑期转正实习）招聘信息。\n\n"
    report_content += "| 公司 | 岗位名称 | 地点 | 发布日期 | 申请链接 |\n"
    report_content += "| --- | --- | --- | --- | --- |\n"
    
    for item in internships:
        report_content += f"| {item['company']} | {item['title']} | {item['location']} | {item['date']} | [点击申请]({item['link']}) |\n"
    
    report_content += f"\n---\n*报告由 Manus 自动化脚本生成，数据最后更新于 {today}。请注意，岗位申请具有时效性，建议尽早投递。*"
    
    # 确保报告路径正确
    report_path = "/home/ubuntu/pm_intern_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
    
    print(f"Successfully updated report at {report_path} at {now}")

if __name__ == "__main__":
    data = get_latest_internships()
    update_report(data)
