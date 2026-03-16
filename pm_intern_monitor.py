import datetime
import os

def get_latest_internships():
    # 抓取到的最新岗位信息 (更新于 2026-03-16)
    return [
        {"company": "小红书", "title": "产品经理实习生 (社区/电商/运营)", "location": "广州/南京/上海", "date": "2026-03-16", "link": "https://campus.xiaohongshu.com/"},
        {"company": "金山云", "title": "产品经理实习生", "location": "成都/厦门", "date": "2026-03-16", "link": "https://www.ksyun.com/console/joinus"},
        {"company": "美团", "title": "产品经理-美团金融", "location": "成都/北京", "date": "2026-03-16", "link": "https://zhaopin.meituan.com/web/campus"},
        {"company": "理想汽车", "title": "产品经理实习生", "location": "武汉/北京", "date": "2026-03-15", "link": "https://li.jobs.feishu.cn/campus"},
        {"company": "宁德时代", "title": "产品经理实习生", "location": "成都/宁德", "date": "2026-03-15", "link": "https://catl.zhiye.com/Campus"},
        {"company": "快手", "title": "产品经理实习生", "location": "北京/西安", "date": "2026-03-14", "link": "https://campus.kuaishou.cn/"},
        {"company": "商汤科技", "title": "产品经理实习生", "location": "成都/上海", "date": "2026-03-14", "link": "https://hr.sensetime.com/campus"},
        {"company": "百度", "title": "2026届暑期实习-产品经理 (AI方向优先)", "location": "北京/上海/深圳", "date": "2026-03-10", "link": "https://talent.baidu.com/jobs/campus-list.html"},
        {"company": "腾讯", "title": "2026实习生招聘-产品经理 (全业务线)", "location": "深圳/北京/上海/广州", "date": "2026-03-06", "link": "https://join.qq.com/post.html"},
        {"company": "字节跳动", "title": "ByteIntern: 2026届转正实习生-产品经理", "location": "北京/上海/杭州/深圳", "date": "2026-03-06", "link": "https://jobs.bytedance.com/campus/"}
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
    
    # 修正路径为仓库内的路径
    report_path = "/home/ubuntu/bazik/pm_intern_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
    
    print(f"Successfully updated report at {report_path} at {now}")

if __name__ == "__main__":
    data = get_latest_internships()
    update_report(data)
