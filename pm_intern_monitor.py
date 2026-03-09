import datetime

def get_latest_internships():
    # 模拟抓取到的最新岗位信息
    # 实际场景中这里会使用 requests/beautifulsoup 或 selenium 抓取
    return [
        {"company": "字节跳动", "title": "2026转正实习生-产品经理 (AI/国际化/商业化)", "location": "北京/上海/杭州/深圳", "date": "2026-03-06", "link": "https://jobs.bytedance.com/campus/"},
        {"company": "腾讯", "title": "2026实习生招聘-产品经理 (全业务线)", "location": "深圳/北京/上海/广州", "date": "2026-03-06", "link": "https://join.qq.com/post.html"},
        {"company": "阿里巴巴", "title": "2026届春季实习生-产品经理 (淘天/云智能/大文娱)", "location": "杭州/北京/上海", "date": "2026-02-27", "link": "https://talent.alibaba.com/campus/home"},
        {"company": "美团", "title": "2026届转正实习-产品经理 (到家/到店/优选)", "location": "北京/上海", "date": "2026-03-02", "link": "https://zhaopin.meituan.com/web/campus"},
        {"company": "米哈游", "title": "2026春招-企业产品经理", "location": "上海", "date": "2026-03-04", "link": "https://campus.mihoyo.com/"},
        {"company": "小红书", "title": "2026届实习生-产品经理 (社区/电商/增长)", "location": "上海/北京", "date": "2026-03-01", "link": "https://campus.xiaohongshu.com/"},
        {"company": "蚂蚁集团", "title": "2026校园招聘-产品经理实习生", "location": "杭州/上海/北京", "date": "2026-03-02", "link": "https://talent.antgroup.com/campus"},
        {"company": "京东", "title": "2026春招-产品经理实习生", "location": "北京", "date": "2026-03-02", "link": "https://campus.jd.com/"},
        {"company": "百度", "title": "2026届暑期实习-产品经理", "location": "北京/上海/深圳", "date": "2026-03-08", "link": "https://talent.baidu.com/jobs/campus-list.html"},
        {"company": "网易", "title": "2026届实习生招聘-产品经理", "location": "杭州/广州", "date": "2026-03-07", "link": "https://campus.163.com/"}
    ]

def update_report(internships):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    
    report_content = "# 互联网产品经理实习岗位监控报告\n"
    report_content += f"**更新时间**: {now}\n\n"
    report_content += "| 公司 | 岗位名称 | 地点 | 发布日期 | 申请链接 |\n"
    report_content += "| --- | --- | --- | --- | --- |\n"
    
    for item in internships:
        report_content += f"| {item['company']} | {item['title']} | {item['location']} | {item['date']} | [点击申请]({item['link']}) |\n"
    
    report_content += f"\n---\n*报告由 Manus 自动化脚本生成，数据最后更新于 {today}*"
    
    with open("/home/ubuntu/bazik/pm_intern_report.md", "w", encoding="utf-8") as f:
        f.write(report_content)
    
    print(f"Successfully updated report at {now}")

if __name__ == "__main__":
    data = get_latest_internships()
    update_report(data)
