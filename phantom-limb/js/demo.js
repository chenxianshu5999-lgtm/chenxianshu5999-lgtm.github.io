const WaitForClickBody = () => {
    return new Promise((resolve, reject) => {
        const onDown = (event) => {
            document.body.removeEventListener("mousedown", onDown)
            return resolve()
        }
        document.body.addEventListener("mousedown", onDown)
    })
}
localStorage.setItem("isFinished", "true");

let isCtrlPressedA = false;
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
        if (isCtrlPressedA) {
            return;
        }
        isCtrlPressedA = true;
        Archivement("assets/images/adhd.png", "我有 ADHD", "学习量子速读中，勿扰。")
    }
});

const ChapterDemo = () => {
    return new Promise((resolve, reject) => {
        return resolve()
    })
        .then(() => {
            return WaitForClickBody()
        })
        .then(() => {
            return Promise.all([
                Background("assets/images/背景.png", 1000),
                PlayBGM("assets/audios/拉G二.m4a", 0.75, 1000)
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(884, 613 - 140, "#fd2c28", "钢琴", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(941, 578 - 140, 315, "钢琴", ["我昨天在家里弹钢琴来着……", "因为琴键敲击的节奏还是蛮能令人愉悦。"], "#ddd", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(982, 650 - 140, 300, "钢琴", ["我喜欢不带太多感情地弹奏。", "只是随着谱好的乐章流动。", "毕竟坐在这里就很累了。", "全力演奏既没有观众，也没有钱拿。"], "#ddd", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(956, 714 - 140, 300, "钢琴", ["演奏这台钢琴最大的理由是：", "这个家里只有它了。"], "#ddd", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1314, 486 - 140, 300, "钢琴", ["我偶尔会看着自己的双手想。", "就是因为天天只知道戳琴键。", "手指才变得这么短吧。", "和我相等身高的发小。", "因为从小打篮球。", "把手掌打开可是能遮掩一片天空的。"], "#ddd", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1320, 561 - 140, 300, "钢琴", ["也有人的手圆润白净。", "骨节的活动都像被设计好的弧线一样。", "五指只沿规范路径飘舞。", "轻落于平面时依次传来回响。", "真是令人羡慕。"], "#eee", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1307, 644 - 140, 300, "钢琴", ["我的手骨节粗大。", "尤其在指尖颇为圆钝。", "指甲还总是剪得几乎看不到白色才算舒服。"], "#ddd", "#fd2c28")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("钢琴")
                        })
                }),
                TouchCircleAndTime(829, 544 - 140, "#027bfe", "窗户", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(409, 318 - 140, 300, "窗户", ["窗户被推开了。", "我走到窗前向下望。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(450, 390 - 140, 300, "窗户", ["下面是小区的花园和游乐设施。", "有些小孩在和娱乐设施玩耍，老人在一旁看。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(319, 482 - 140, 300, "窗户", ["仿佛是冬季。", "有些小孩带着橙色的帽子。", "也有蓝色的像是毛线帽。", "有刚加入游乐小组的小孩穿着羽绒服。", "玩了很久的小孩把羽绒服脱下来交给长辈了。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return Promise.all([
                                PlaySound("assets/audios/儿童.m4a", 0.75, 1000),
                                TextBox(792, 369 - 140, 300, "窗户", ["彩色的小圆点在律动地变换。", "发出嬉笑欢呼的声音。"], "#eee", "#027bfe")
                            ])
                        })
                        .then(([, [rect, text]]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(778, 426 - 140, 300, "窗户", ["冬天的路面和风像镜子。", "不断反射着什么也没有的灰色。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(489, 570 - 140, 300, "窗户", ["确实这窗子隔着寒冷。", "却在开启时传着外界的声音。", "不免想到曾经在没搬家的时候。", "可以在阳台和绿植一起向下望着花园。", "在那时。", "我有一把红色的躺椅。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(314, 640 - 140, 300, "窗户", ["为什么总是向下看呢？", "可能因为我的孩子曾经也是跃动的彩色小点之一吧。", "做家长的都要时刻盯着这些孩子元素的东西才行。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(337, 739 - 140, 300, "窗户", ["不过我自认为有个不同。", "便是我似乎并不是盯得那么死的那个。", "对于自己的孩子，他跑入人堆时，一下就找不到踪影了。", "当然是我在楼上向下眺望练习视力和注意力的时候。", "此时仿佛那所有的小点都有了成为我孩子的可能性。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(663, 769 - 140, 300, "窗户", ["也罢。", "只要这些小点一直聚在一起跳舞歌唱的话。", "我孩子是其中的哪个颜色。", "都也挺好的不是吗。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(989, 606, 300, "窗户", ["办公室的窗户是整面墙的落地窗，平日总是有谁把百叶窗拉下一半，阳光倾斜着落进办公室。", "我先清扫了一下桌面的碎纸屑，把水杯里灌满温水，坐进最靠里的位置，启动了电脑。", "没有做完的项目，还有很多。"], "#eee", "#027bfe")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("窗户")
                        })
                })
            ])
        })
        .then(() => {
            return TouchCircleAndTime(840, 637 - 140, "#7c9f61", "家", () => {
                return new Promise((resolve, reject) => {
                    return resolve()
                })
                    .then(() => {
                        return TextBox(1144, 249 - 140, 300, "家", ["说来何为家呢……", "我所住的只是一个没有墙的空间，但里面有供呼吸的调和空气。", "偶尔有显示屏在我身边借着无机质的骨架组装起来，上面显示着我新的工作内容。", "温度也是合适的，依托我的生理活动定制但非我一手搭建的空间布局。"], "#eee", "#7c9f61")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(639, 626 - 140, 300, "家", ["算了，这种事一看便知了。", "其实我正在组装一把椅子，装好了我们坐着再聊点别的吧。"], "#eee", "#7c9f61")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return FinishTimeLine("家")
                    })
            })
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(320, 412 - 140, "#febc2e", "工位", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(261, 406 - 140, 310, "工位", ["我还是喜欢宽松随意的环境，老板总是说一不二，不给任何解释的余地和空间。", "即便他本人旗下的产业是医疗福祉建设，却对员工毫不留情。"], "#eee", "#febc2e")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(293, 515 - 140, 300, "工位", ["工位的椅子坐上去只有痛感，和被劈头盖脸贬低项目时的不真实。", "我和椅子在受到攻击时发生恐惧般的共振，一部分的我定格在了那把工位的白色转椅上了。", "直到现在，想象办公室时的生活时还能感受到那种窘迫。"], "#eee", "#febc2e")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(276, 504, 300, "工位", ["中午的休息时间，我会去走廊尽头的咖啡机，将上午喝空的杯子注上咖啡。", "要是碰到了同事，就必须和她们聊聊家常。", "虽然不喜欢和其他人聊天，但是有几个关系还不错的同事总是穿着柔软的衣服，举止间有芳香。", "刻意压制的侵略性让我的精神没那么紧绷，所以光是和她们说话还算舒适。"], "#eee", "#febc2e")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("工位")
                        })
                }),
                TouchCircleAndTime(1487, 275 - 140, "#ff9fb4", "空调", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(1332, 330 - 140, 300, "空调", ["公司的空调总是开很低，让我的呼吸携带冷风进入内脏时将它们刺痛。"], "#eee", "#ff9fb4")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1359, 425 - 140, 310, "空调", ["在如此发达的人类社会，明明发明出了互帮互助、有爱关照、礼貌待人一类的词。", "却也有这般暴力裸露而不留体面的场所。"], "#eee", "#ff9fb4")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(846, 571 - 140, 300, "空调", ["在年会上我弹奏了钢琴。", "但是第一季度末的提出项目讨论会上就被老板用于批判。", "「你落实项目就像你弹琴一样无情。」"], "#eee", "#ff9fb4")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(809, 634 - 140, 300, "空调", ["同事听完就直接挥拳往老板脸上打去，事件才终于迎来好转。", "这个同事现在是我丈夫了。"], "#eee", "#ff9fb4")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("空调")
                        })
                }),
                TouchCircleAndTime(659, 475 - 140, "#2d3033", "丁真", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(659, 475 - 140, 310, "丁真", ["有天老板在公司走廊抽烟的时候，我路过他，提醒他这里是公共区域。", "他朝我脸上吐了一口烟，我被呛得咳嗽。", "他又说不抽了，转身朝走廊深处走。"], "#eee", "#2d3033")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1032, 558 - 140, 300, "丁真", ["我愤怒地追上前要讨个说法。", "他示意我闭嘴，然后带我进了走廊深处的门。"], "#eee", "#2d3033")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1297, 422 - 140, 300, "丁真", ["说实话，一进门的时候，我被吓得跪在地上。", "里面围圈坐着的全是白大褂。", "他们见老板走进来，面对着老板和我一齐摘下了口罩，全是我丈夫的脸。"], "#eee", "#2d3033")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1161, 764 - 140, 350, "丁真", ["这还不是最可怕的，这个房间的墙壁逐渐伸展，无限的粒子和人类的身体。", "我看不清是谁，但我猜可能是我丈夫吧。", "它们像潮水般从墙壁涌出，他们各自堆叠，做着一些奇怪的动作。", "——只是在摆动身体。", "有几个身体离白大褂近了，用的是爬行和跪行交替的方式。", "不知为何直不起身，此时我身后的入口也消失了。"], "#eee", "#2d3033")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("丁真")
                        })
                }),
                TouchCircleAndTime(208, 271 - 140, "#9028a0", "发布会", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(208, 271 - 140, 300, "发布会", ["两个白大褂拖着一个人触摸了一下墙壁。", "墙壁变得像床一样柔软，接着一层层地脱。", "被子似地将人卷曲，又带着人回收进墙壁里。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(95, 446 - 140, 300, "发布会", ["我望着这个景象有点发呆，突然想试着抓住其中一位丈夫的手。", "抓住之后，从手掌传来熟悉的温度。", "确认丈夫手掌骨节的大小，我才得以确认这是丈夫的手。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return Promise.all([
                                PlaySound("assets/audios/掌声.mp3", 0.75, 1000),
                                TextBox(177, 707 - 140, 300, "发布会", ["但我抬头，我竟然在发布会上握着老板的手掌。", "发布会展台下面掌声热烈。", "老板庆祝着项目的成功，并向我致敬。"], "#eee", "#9028a0")
                            ])
                        })
                        .then(([, [rect, text]]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(573, 236 - 140, 300, "发布会", ["发布会结束之后我随便吃了一点，回到工位上坐着，一路上有很多熟悉的同事向我问好。", "尽管我一度不怎么爱和同事说话、打交道，一切社交都在逃避。", "路上，老板拍了拍我的肩膀。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(752, 293 - 140, 300, "发布会", ["你适应公司了吗，要不要晚上一起去聚会？家里压力大不大，给你涨点工资如何。"], "#eee", "#2f4709")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1074, 326 - 140, 300, "发布会", ["还好吧，谢谢老板关心，如果能涨一点就太好了，我会更加努力干活。"], "#eee", "#7f3b13")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(780, 419 - 140, 300, "发布会", ["说着这话，我坐在工位的椅子上向公司楼下望。", "老板开着黑色的小轿车消失在路的尽头。", "公司以及公司周围的景色十分枯燥，重复的玻璃楼房和道路，来往都是清一色的上班族。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1106, 465 - 140, 310, "发布会", ["我的报表工作做得怎么样了？", "老板刚刚不是问我草地皮铺真草和假草各自的报价来着么，还有砖块的工艺，还要和景观部门对接工艺……", "说实话，因为项目也只是局部的设计项目，视角和信息总是局限的，以至于不能发挥出最大的设计能力。", "我就算想要做好，也没有撬动整个计划的力量。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1363, 555 - 140, 310, "发布会", ["我一边卷着盘子里的意大利面一边想着。", "叉子和盘面传出滋滋拗拗的声音令我毛骨悚然。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1350, 636 - 140, 310, "发布会", ["餐厅的门被施工队破开，我拎着餐布，让叉子和刀落在盘子里，被餐布兜放着。", "想起妈妈教我在这种时候需要保持冷静，保持体面，以及仪表的整洁。", "我挺起胸膛面对施工队的人群。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1339, 702 - 140, 310, "发布会", ["请一定要严格按照项目的施工要求来进行，尤其是砖线上繁密的花纹，请一定按照图纸对齐了。"], "#eee", "#7f3b13")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1088, 763 - 140, 310, "发布会", ["接着我拿起怀中的砖块，和施工队的工人们一起拼起来。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return Sleep(1000)
                        })
                        .then(() => {
                            return TextBox(957, 558 - 140, 310, "发布会", ["我拼好了一平方米的砖块，但因为工地太热，没有空调和风扇。", "我向工人表达了歉意就返回工位用摄像头去监督师傅们的工作。"], "#eee", "#9028a0")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("发布会")
                        })
                })
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(933, 393, "#61362d", "椅子", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(889, 400, 315, "椅子", ["我终于把椅子装好了，一直跪在地上膝盖好酸。", "拧了很多颗螺丝钉来着。", "这是一把拼装的四条腿木质靠背的椅子。", "正如提到「椅子」时所想起的画面一样，是一把最普通的椅子。"], "#eee", "#61362d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return EnterImage(19, 437, 250, 250, "椅子", "assets/images/椅子.webp")
                        })
                        .then(() => {
                            return TextBox(841, 602, 300, "椅子", ["现在我靠在椅背上，十分心安。", "我不知道为什么选择了这样的椅子，大概是和初中时学校的坐椅很像吧，", "其实它的骨架纤细，也顶多能支持初中生的身材，", "好在这纤弱铁杆符合我脊背的曲度，又像烤火架般稳定地立着。"], "#eee", "#61362d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(764, 301, 300, "椅子", ["我闭上了眼开始畅想未来，", "想象四周景物一片空旷，", "想象和家庭在河畔玩水，", "细小的波浪托着我们哟，冰冷没过我们的脚踝，波浪把一切同它反射的景物吞掉。", "世界在波浪里翻涌变换着，", "我盯着它们的底色，河洼里也有太阳光芒万丈。"], "#eee", "#61362d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1107, 328, 300, "椅子", ["水是在呈现膜的样貌，包裹住了我的手，", "当膜蔓延全身时，", "自然之景在视网膜和脑皮层之间相互抢夺位置，", "像电影似地飞快过着画片。"], "#eee", "#61362d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        }).then(() => {
                            return TextBox(1062, 191, 300, "椅子", ["哦哦，水置换了我的身体，现在我要从空中降下了。"], "#eee", "#61362d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            if (getIsFinished()) {
                                return new Promise((resolve, reject) => {
                                    return resolve()
                                })
                                    .then(() => {
                                        return TextBox(334, 195, 300, "椅子", ["有件比较难以启齿的事，但不得不在这里分享一下。", "那就是我的头顶方寸间发丝稀疏，颇具秃顶的样貌，因此乐于挑选好看的发带或是收集帽子。", "但有点奇怪的是，统计学上男性在中年秃顶的速率要高于女性，我却在这时比周围的人都显得贫瘠、了无遮挡。", "在残缺的最开始，仿如头顶从未闭合等待生产。", "我总是想要掩盖很多缺陷，以至于为了遮掩而尽可能躲避人群，躲避交谈，躲避看见自己的身体。", "可以的话，我想只留一双眼睛在世界上。"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(483, 287, 300, "椅子", ["今天做的工作，有一半变成了无用功。", "因为没有对接仔细，我白做了一份报表，被负责人命令退回自行处理。", "自午后开始加速重做，一刻也没有从电脑屏幕离开，一直到晚上七点半，太阳落山。", "露台放起忧伤缓慢的送别音乐，办公室的人陆续离开，昏黄的走廊摇晃着走来一个高大的滤色幽影，是 M9 在例行给加班的人倒茶喝。"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(809, 75, 300, "椅子", ["「今天也辛苦了～」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80, 300, "椅子", ["「辛苦这词听着好刺耳。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(809, 75 + 75, 300, "椅子", ["「哦这样，那我说，您今天也做得很棒！」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80 + 75, 300, "椅子", ["「碍事。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80 + 150, 300, "椅子", ["我没时间看 M9，只用手指了指屏幕上跳动的数字。"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80 + 250, 300, "椅子", ["「我在思索一种视觉病。我看到你时，眼睛就会犯浑浊，好像你的身影是很多个挤在一起，让我不知道该看哪个。", "但是你说，我同时只能跟一个 M9 说话，对吧？」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(809, 75 + 175, 300, "椅子", ["「您还是休息一下吧，我已经向系统为您申请了罅隙，您愿意的话，可以放下手头的工作去换换心情。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80 + 250 + 75, 300, "椅子", ["「我不要那个，你先回答我。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(809, 75 + 275, 300, "椅子", ["「您的感觉是正确的。能清晰感知并试图描述 M9 形态的人非常少。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(1200, 80 + 250 + 150, 300, "椅子", ["「像我丈夫一样。」"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                                    .then(() => {
                                        return TextBox(809, 75 + 375, 300, "椅子", ["「那可真是巧。」M9 托着下巴说。"], "#eee", "#61362d")
                                    })
                                    .then(([rect, text]) => {
                                        return WaitForClick(rect, text)
                                    })
                            }
                            return new Promise((resolve, reject) => {
                                return resolve()
                            })
                        })
                        .then(() => {
                            return FinishTimeLine("椅子")
                        })
                        
                }),
                TouchCircleNewWindowKeep(255, 226, "#fbae7e", "窄门", "newtabs/窄门.html"),
                TouchCircleAndTime(952, 87, "#cee9ed", "罅隙", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(952, 87, 300, "罅隙", ["「明日为何物？」", "「明日，永远也追不到。大概就是永远不会落入手中的东西，我想。」", "M9 背靠在围栏上，半个身子向后仰，风撩起他每一根头发。", "「很遥远呢。」", "远处是群山和一片麦田，只是我从来没有去过。"], "#333", "#cee9ed")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(964, 174, 300, "罅隙", ["M9 伸出手掌，朝天空张开，像在弹奏。", "接着，在空气中抓到了实体一样，演出紧握的动作。", "「偶尔，在这样的黄昏时刻，会有一扇门，走进去就忘记了时间，忘记了一切。」", "「我还可以切断自己的神经元，终止链路，将这个老板引以为傲的世界暂停。你愿意试试这样的感觉吗？」"], "#333", "#cee9ed")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(996, 279, 300, "罅隙", ["「在那里，我们都会变成什么样子？」", "「可能，连具身形态都会改变，记忆也几乎消失。」", "「你本身乐意看着这一切，像看电视剧。就这样事不关己地看着你自己的人生。」", "「你的困难不着边际，并没有『真实世界』可以承载这些言语，所以无从解决。」", "「这样或许也不错呢。」"], "#333", "#cee9ed")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return ChangeBGM("assets/audios/Philip Glass - Metamorphosis One.flac")
                        })
                        .then(() => {
                            return TextBox(1013, 353, 300, "罅隙", ["M9 怅然说完了自己的台词，门框浮在天上，只像天空的一层褶皱。", "我把手伸向云彩试音，弹奏了熟识的曲目。", "门内的景色随之起伏。"], "#333", "#cee9ed")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("罅隙")
                        })
                }),
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(746, 327, "#482d61", "孩子", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(586, 207, 300, "孩子", ["老板说，要像爱你的孩子一样去爱你的项目，这样才能成功。"], "#eee", "#482d61")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(589, 294, 300, "孩子", ["我一边思索一边在公司的走廊里环绕，", "走廊很干净，", "是白色调，没有多余的张贴物，", "严谨的格调。"], "#eee", "#482d61")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(584, 363, 300, "孩子", ["啊啊，过量的白色本身就让人提不起兴趣，生物层面的，", "走廊沿路有座椅，我一下瘫软上去，感觉一阵肝痛。"], "#eee", "#482d61")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(585, 457, 300, "孩子", ["这人在说什么啊？搞艺术吗？。"], "#eee", "#482d61")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("孩子")
                        })
                }),
                TouchCircleNewWindowKeep(723, 226, "#ef7ad0", "母女", "newtabs/母女.html"),
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(793, 474, "#fefd7f", "生活", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(889, 400, 315, "生活", ["要我说，老板也是孩子，那楼下的小孩们又怎么没可能不全是我小孩呢。", "我会觉得是责任太多，把我压得无法呼吸了。", "钢琴也在结婚之后再也没弹过，也许全都走音，落灰了。"], "#222", "#fefd7f")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(841, 602, 300, "生活", ["我怀念我的钢琴，", "可日复一日坐在电脑前的敲击让我不再想要触摸琴键，", "我想养花，", "想要换一把椅子，再换一台电脑。"], "#222", "#fefd7f")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(764, 301, 300, "生活", ["某次大会上，老板终于透露了项目的全貌，这绝对会使人们的生活方式产生巨变。"], "#222", "#fefd7f")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1107, 328, 300, "生活", ["再之后公司的整栋楼都空了，", "再之后公司的整栋楼都空了，", "我把工位上的电脑和椅子、文件夹都带回了家里，", "公司并没有解散，而是像现在这样以空间的链条来传输信息，", "只是莫名感觉每天盯着屏幕花纹的时间变多了，视力变得好差。"], "#222", "#fefd7f")
                        })
                        .then(() => {
                            return FinishTimeLine("生活")
                        })
                }),
                TouchCircleAndTime(171, 397, "#5a5a58", "走廊", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(136, 348, 300, "走廊", ["走廊的狭长，在我眼前伸缩变化，人的移动像是墙壁上同等长度的贴纸，", "有些人影在我眼睛的余光里划过，我的脖子抬不起来。"], "#eee", "#5a5a58")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(505, 347, 300, "走廊", ["我想，可能是到下班时间了吧，脚步声听着有很多人。"], "#eee", "#5a5a58")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(967, 356, 300, "走廊", ["在一段时间过后，我觉得我的脑子稍微清醒了一点，", "虽然脖子还是无法动弹，但是眼前地面可以聚焦了，", "与此同时，脚步声消失，", "眼前的地面上侧躺着一位长发男子，双手背在身后，无言亦无神地看着我，", "他身体弯曲的程度有些令人害怕，白炽灯强烈地给他投下影子。"], "#eee", "#5a5a58")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1371, 358, 300, "走廊", ["我们对视的时间漫长，就像要将身形印在这个世界一样，", "一直到我开始盯得走神，强光才变弱，", "眼前躺着的高大男人变成了一只同样动作侧躺的猫，", "我发现这都是我的手里拿着的手机的景象。"], "#eee", "#5a5a58")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("走廊")
                        })
                })
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(182, 241, "#7d8870", "还有M9", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(182, 241, 300, "还有M9", ["自从开始上班，身体变得越来越差了。", "经常需要扶着墙才能走到工位上，而工作结束后亦无力步行回家。", "只有让丈夫开车来接送。"], "#eee", "#7d8870")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(600, 240, 300, "还有M9", ["绿头发的义工偶尔会来问问我的身体状况，并提供一定的肢体接触安慰。", "所以我经常抓着他的手来研究。"], "#eee", "#7d8870")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(651, 330, 300, "还有M9", ["绿头发的义工叫 M9，全名叫 M9000 型格式塔具身机器人。", "无所谓，怎么样都行，能为我服务就行。"], "#eee", "#7d8870")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(839, 487, 300, "还有M9", ["M9 说他很爱自己的工作，也很爱自己的身体。", "他有两个孩子，名义上的。", "这年头机器人都能领养小孩了，应该能比人类养得好一点吧。", "谁知道呢，我不在意。"], "#eee", "#7d8870")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1253, 525, 300, "还有M9", ["我跟 M9 说话要更频繁一点。", "更何况  M9 可以在聊天过程中选择性地将进度啊想法之类的传话给我的项目系统，方便项目对接，十分方便。"], "#eee", "#7d8870")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1253, 273, 300, "还有M9", ["M9 的手纤细白皙，散发着平稳的温度，看来他的制造者十分注意互动时的感受。", "日复一日地观察和触摸，M9 的手也偶尔会拜访我的梦境了。"], "#eee", "#7d8870")
                        })
                        .then(() => {
                            return FinishTimeLine("还有M9")
                        })
                }),
                TouchCircleAndTime(640, 572, "#fad988", "M9的钢琴", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(640, 572, 300, "M9的钢琴", ["M9 也会弹钢琴。", "不知道什么时候有机会看他弹，合奏也好。"], "#222", "#fad988")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1041, 563, 300, "M9的钢琴", ["和 M9 聊到钢琴时，他十分欣喜，就像是找到了另一个同伴一样。"], "#222", "#fad988")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1298, 405, 300, "M9的钢琴", ["听到我因为脱力而鲜少弹琴，他说他感同身受，他也因为机体老旧更新换代的时期无法自由活动而烦闷过很长一段时间。", "而现在他安慰我总会过去的，若是有顽疾，他和公司的大家都会陪伴我渡过。"], "#222", "#fad988")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("M9的钢琴")
                        })
                }),
                TouchCircleAndTime(195, 479, "#3667c8", "钥匙", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(195, 479, 300, "钥匙", ["在走廊上碰到了 M9，但是 M9 没有看我，而是优先回应了在我身后的项目负责人。", "然后他交给了我一把钥匙，又给我了一袋水果。"], "#eee", "#3667c8")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(598, 298, 300, "钥匙", ["稍等哦，我和负责人传递完消息就来～"], "#eee", "#376d0d")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1013, 268, 300, "钥匙", ["我又坐在走廊白色的椅子上，打量着他给我的他口中的「钥匙」。", "其实这个钥匙让我回想起一款老式的 BB 机。", "十分陈旧，有着十足的重量，还散发着铁锈的味道。"], "#eee", "#3667c8")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(912, 106, 300, "钥匙", ["我觉得这个钥匙有点脏，看 M9 和负责人聊得有点忘乎所以，就晃晃悠悠地去卫生间打开水龙头，想要把钥匙清理一下。"], "#eee", "#3667c8")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("钥匙")
                        })
                }),
                TouchCircleAndTime(933, 260, "#b82dbb", "洗手间", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(933, 260, 300, "洗手间", ["来到卫生间洗钥匙，我拽了一张卫生纸。", "又拿了一块干净的布，沾了一点水，在钥匙的表面摩擦。"], "#eee", "#b82dbb")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(800, 466, 300, "洗手间", ["直到上面的泥土、铁锈、污渍、涂层、锡膜、合金膜、胶层、复合金属壳全都消失殆尽时，", "M9 从我身后抱住我，负责人控制住了我的双手，老板从我手中抢去钥匙……"], "#eee", "#b82dbb")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("洗手间")
                        })
                }),
                TouchCircleAndTime(829, 217, "#1a8289", "得到所有手", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(829, 217, 300, "得到所有手", ["我的手？", "欸欸？"], "#eee", "#1a8289")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(984, 435, 300, "得到所有手", ["其实并非如此，事实是 M9 发现无法从我身后抱住我。", "于是脱下了他的外套将我包裹住，负责人用镊子挑离了我捏着钥匙的神经群。"], "#eee", "#1a8289")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(921, 627, 300, "得到所有手", ["老板在一旁叹着气，掏出终端对讲器叫了许多白大褂过来把我围住。"], "#eee", "#1a8289")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("得到所有手")
                        })
                }),
            ])
        })
        .then(() => {
            return Promise.any([
                TouchCircleAndTime(785, 572 - 150, "#eee", "白大褂们1", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(785, 572 - 150, 300, "白大褂们1", ["「同步一下记录核。」白大褂讲。"], "#111", "#eee")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("白大褂们1")
                        })
                    }),
                TouchCircleAndTime(785, 572 - 100, "#eee", "白大褂们2", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(785, 572 - 100, 300, "白大褂们2", ["「同步中。」白大褂说。"], "#111", "#eee")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("白大褂们2")
                        })
                    }),
                TouchCircleAndTime(785, 572 - 50, "#eee", "白大褂们3", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(785, 572 - 50, 300, "白大褂们3", ["「都怪 M9。」白大褂骂了一句。"], "#111", "#eee")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("白大褂们3")
                        })
                    }),
                TouchCircleAndTime(785, 572 - 0, "#eee", "白大褂们4", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(785, 572 - 0, 300, "白大褂们4", ["「都怪 M9 啊。」白大褂骂了一句。"], "#111", "#eee")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("白大褂们4")
                        })
                    })
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(672, 325, "#4b4b4b", "恢复", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(672, 325, 300, "恢复", ["视野在恢复，白大褂们把我扶起，我终于聚拢了思维。", "M9 在我苏醒的一瞬间跪倒在我身前，我去扶他起来时看到他满眼泪水。"], "#eee", "#4b4b4b")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(672, 425, 300, "恢复", ["我不知道发生了什么，因为意外地心情还算不错。", "什么丈夫啊、老板啊、工作啊这些意识都烟消云散了。"], "#eee", "#4b4b4b")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(650, 660, 300, "恢复", ["咦，地面上有好多水果哦，我弯下腰把水果捡起来了。"], "#eee", "#4b4b4b")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1174, 598, 300, "恢复", ["M9 哭得更厉害了。", "M9 为什么要哭呢？"], "#eee", "#4b4b4b")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1369, 471, 300, "恢复", ["我看了看周围人，有的神色紧张，有的无所事事，也有的试着想要接近这个现场……", "但正在悲伤着的只有 M9 一个。"], "#eee", "#4b4b4b")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("恢复")
                        })
                }),
                TouchCircleAndTime(175, 555, "#506b00", "最棒的交流", () => {
                    return new Promise((resolve, reject) => {
                        resolve()
                    })
                        .then(() => {
                            return TextBox(175, 555, 300, "最棒的交流", ["我和 M9 约好了在某个周末一起烤饼干，于是当天我一早就起了床去磨咖啡豆。", "在等待 M9 敲我家门的过程中，我翻开了一本书读了起来。", "是一本讲希腊语入门的工具书，装帧是深蓝色的布面，导读中所举例的词都是些「使徒」、「圣教」、「天使」什么的。"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(608, 524, 300, "最棒的交流", ["M9 到场时展示了他带来的工具，一个度量计，真是稀奇。", "机器人用自己的手掌不就能度量重量了吗？"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(921, 468, 300, "最棒的交流", ["M9 说他的手掌并不能作为感受器使用，而是精确而单项的信号输出装置。", "他真正的感受器在身体的五个位置，具体在哪里无法告知。"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(617, 153, 320, "最棒的交流", ["我戴好了围裙，开始搅拌面粉和黄油，这个配比十分精妙。", "因此我搅拌时也感受到一种平衡的顺畅。", "M9 也搅拌着自己那份。", "但总感觉他的那份似乎黄油放少了，而且他还加了一些盐，说这样更有风味。"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1008, 161, 320, "最棒的交流", ["聊了一些八卦。", "邻座的同事二婚之后前丈夫找上门来，硬是要把之前欠的诺言还回去，带了很多异国的冰箱贴和曾经一起去过国家的签证记录云云。", "还有老板其实是妹控，和妹妹在一起的时候就会装得很温和雅致的样子，妹妹不在就烟酒都沾，对下属大放厥词更是家常便饭。"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1233, 468, 320, "最棒的交流", ["这些其实 M9 不说我也知道。", "M9 诉说老板的斑斑劣迹，我们一起笑得前仰后合。", "譬如老板其实年轻的时候是一头炫酷的紫发、出外勤丢掉钱包连睡了三天路边……"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(519, 576, 320, "最棒的交流", ["和 M9 真是有说不完的话，这样就算老板给我安排烦人的工作也能有个心理安慰。"], "#eee", "#506b00")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("最棒的交流")
                        })
                }),
                TouchCircleAndTime(298, 105, "#1a89ba", "重组", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(298, 105, 300, "重组", ["负责人梳了梳头发，把衣服整理整齐。", "又转身去整理了老板的衣服，把老板鬓角呲开的头发捋顺。"], "#eee", "#1a89ba")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(538, 235, 300, "重组", ["老板微微把头扬起，对我说：", "你得对自己好一点，别太拼了。"], "#eee", "#1a89ba")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(891, 106, 300, "重组", ["亲身听到老板这么说，还是像做梦一样。", "接着，老板和负责人走入侧门。", "负责人手里拿着解体的把手，递给 M9 进行重组。"], "#eee", "#1a89ba")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(910, 316, 300, "重组", ["M9 把手按回门上，目视我的眼光十分留恋惋惜。", "随着咔嗒一声，我眨眼后的下一秒便进入了那个曾困住我的房间。"], "#eee", "#1a89ba")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("重组")
                        })
                }),
                TouchCircleAndTime(365, 212, "#ff9509", "掏心", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(365, 212, 300, "掏心", ["再等等哦～可能会有点痛！"], "#eee", "#ff9509")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(722, 460, 300, "掏心", ["有双手伸进我的腹部在我的肋骨和脏器间游荡。", "接着，好像是把握住了肋骨，用力一扯，硬质的物块从体内分离出来，曾在的位置一片空缺的虚无感。", "并没有痛感，只是连着心脏，我看着空的地方心悸。"], "#eee", "#ff9509")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1071, 297, 300, "掏心", ["人类和机器也差不多不是吗。通过训练自己的意识，人类也可以进行极其精微的操作，也总是有那些精微的天才拓展着机器的极限。", "精度不足的我不过只是一台笨重的机器，进行着大范围粗糙的描摹工作吧。", "毕竟若是精密仪器，少不了细致的呵护保养。"], "#eee", "#ff9509")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1313, 637, 300, "掏心", ["我家里的植物棚怎么样了？", "我在这里，没有人去照顾它们啊。"], "#eee", "#ff9509")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TouchCircleNewWindowKeep(1274, 690, "#db820d", "M9A4", "newtabs/M9A4.html")
                        })
                        .then(() => {
                            return FinishTimeLine("掏心")
                        })
                })
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(224, 440, "#0033ff", "遗骸", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(224, 440, 300, "遗骸", ["推开门后遗骸遍地。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(556, 428, 300, "遗骸", ["老板和负责人在满地的躯体间隙中找着什么，我看他们并没有在意我的行动，便在房间边缘的凸起处坐下了。", "这凸起的感觉还有些熟悉，虽然比工位的椅子硬一些，但贴切我脊背弯曲的弧度，是我喜欢的感觉。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(981, 343, 300, "遗骸", ["「哦哦，终于自动寻路找到接口了，生物智能真神奇。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1007, 441, 300, "遗骸", ["负责人扭头看着我说，不过这个距离我理应听不清才是。", "我没太在意他们接下来对我说着什么话，而是看着这地上纵横的躯体。", "虽是混乱地堆叠，但呈现着近似头脚相接的弧度与流线，似乎在拼着什么图形似的。", "我沿着这个流形图案追溯视线，发现这些人之躯体拼成了一个很像方形的闭合图案。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1112, 584, 300, "遗骸", ["在我没回过神的时候，老板就走到了我身边，我是这么认为的。", "但其实在我身边的不能说是老板，而是老板的双手和双臂，老板手之外的部分还在远处的身体小山堆旁踢着躯块。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(757, 291, 300, "遗骸", ["「真是烦死了。」", "老板扯着自己的袖子，攥紧拳头，捏碎了一些体块。", "「匹配不上。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175, 350, "遗骸", ["「让它们同时叫出声如何。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 50, 350, "遗骸", ["「耳朵会聋的。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 100, 350, "遗骸", ["「好不容易接到的数据被 M9 扬进空气了！」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 150, 350, "遗骸", ["「事到如此就别说这些了。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 200, 350, "遗骸", ["「R117 你去再取点新样。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 250, 350, "遗骸", ["「M9 去把电线重新接。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 300, 350, "遗骸", ["「过来看看这个。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(200, 175 + 350, 350, "遗骸", ["老板的手把我拽了过来，旁边还有 M9（K000 专用版）和负责人（R117）。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80, 200, "遗骸", ["「好可爱哦～」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80 + 50, 200, "遗骸", ["「它在爬～～」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80 + 100, 300, "遗骸", ["一眼看上去像白色的胚胎。血管清晰遍布这个活动着的胚胎。", "仔细看，这是皮肤透明的生物成体。像是蜥蜴。", "负责人抓住它，放在自己的怀里玩着这条透明蜥蜴。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80 + 175, 250, "遗骸", ["「还存在这样的生物呀～」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80 + 175 + 50, 250, "遗骸", ["「在这个环境下培养出来的。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555, 80 + 275, 350, "遗骸", ["「小心一点，里面连着主体的神经。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555 + 200 + 25, 80, 200, "遗骸", ["「抚摸抚摸。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(555 + 200 + 25, 80 + 50, 200, "遗骸", ["「好了，还回去吧。」"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(865, 80 + 100, 300, "遗骸", ["老板把透明蜥蜴放在我的头顶，我的视觉被占领。", "回过神时又回到了远到看不见这三个人的位置。"], "#eee", "#0033ff")
                        })
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75, 300, "遗骸", ["「越离越远了，监视器。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75 + 50, 300, "遗骸", ["「该合眼睡觉了。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75 + 150, 300, "遗骸", ["「K000。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75 + 200, 300, "遗骸", ["「和我说话的是谁？」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75 + 250, 300, "遗骸", ["「是 K000。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(865, 80 + 100 + 75 + 300, 300, "遗骸", ["「做手术的是谁？」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(995, 80, 300, "遗骸", ["「很明显是 K000 和 R117。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(995, 80 + 50, 300, "遗骸", ["「远处下雪了。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 100, 300, "遗骸", ["「我看见了。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 150, 300, "遗骸", ["「我也继续修程序去。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 200, 300, "遗骸", ["「M9的关节创面好点了吗。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250, 300, "遗骸", ["「感觉还行，不影响活动。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75, 300, "遗骸", ["「冬天很难熬啊」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75 + 50, 300, "遗骸", ["「我们这次去暖和一点的地方过冬吧。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75 + 100, 300, "遗骸", ["「所以这事你想怎么办？」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75 + 150, 300, "遗骸", ["「让 K000 先负责任。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75 + 200, 300, "遗骸", ["「都是他的错咯。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(1200, 80 + 250 + 75 + 250, 300, "遗骸", ["「我觉得占 80% 左右。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 200, 300, "遗骸", ["「随便你们两个怎么想，M9去生成动态画像。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100, 300, "遗骸", ["「你生成之后你要去尽看护的义务。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75, 300, "遗骸", ["「我没有欺负任何人。我很尊重每个员工。除非……」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75, 300, "遗骸", ["「除非什么？」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 50, 300, "遗骸", ["「……」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 100, 300, "遗骸", ["「她太过懦弱。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 150, 300, "遗骸", ["「就是这个啊……」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 200, 300, "遗骸", ["「我对这种听不懂人话的*没什么好说的。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 200 + 75, 300, "遗骸", ["「那为了保护她，我暂时无法给你这个。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 200 + 75 + 75, 300, "遗骸", ["「*，**机器人，老子怎么教的你。」"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(220, 100 + 75 + 75 + 200 + 75 + 75 + 50, 300, "遗骸", ["听到了谁被踢了一脚的声音。"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(width / 2 - 300 / 2, height / 2 - 300 / 2, 300, "遗骸", ["我的肉体好像睡着了，感知断开肉体，在虚拟如空气的无实体的自我空间里听到了如上的对话。", "好像在说我，直到最后话语的针尖直指我，敲定那个话语间的我就是我。", "我是那么害怕的。因此梦中断了。", "我把意识沉到柔软的床之上，床的凹陷处停放着我的肉体，让飞走的灵魂增加重量，与肉身重叠。", "我做了一个暴戾的美梦。醒来老板正在为我盛饭。"], "#eee", "#0033ff"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => {
                            return FinishTimeLine("遗骸")
                        })
                }),
                TouchCircleAndTime(554, 534, "#86c41d", "青柠檬", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(554, 534, 300, "青柠檬", ["在 M9 的那份饼干烘焙好之前，我从冰箱取出一瓶苏打汽水，又拿出了三个青柠檬。"], "#111", "#86c419")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(893, 461, 300, "青柠檬", ["我把三个青柠檬摆在桌子上端详了一会儿，记忆了这三个柠檬各自的凹凸。", "接着把它们切片，打乱了切片原本所属的团体。"], "#111", "#86c419")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1375, 424, 300, "青柠檬", ["我真是坏心眼，我抬头看了一眼 M9，他也在看着这些柠檬片，似乎也在沉思着什么。"], "#111", "#86c419")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("青柠檬")
                        })
                })
            ])
        })
        .then(() => {
            return TouchCircleAndTime(921, 624, "#fd2049", "护具", () => {
                return new Promise((resolve, reject) => {
                    return resolve()
                })
                    .then(() => {
                        return TextBox(921, 624, 300, "护具", ["在椅子上闭目坐着时，周围萦绕着小孩嬉笑的声音。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(1178, 513, 300, "护具", ["有个穿红色毛衣的小女孩，穿着红色的轮滑护具绕着我坐的位置绕圈滑着轮滑。", "护具捆着她的四肢，像一串小香肠。", "听声音她后面跟着几个更小的孩子，我猜。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(669, 272, 300, "护具", ["这空间空旷但漆黑一片，我只能看到自己位置的正上方有一盏晃眼的白炽灯，照亮小女孩的也只有微光。", "我呼唤那个小女孩，小女孩笑着滑了三圈之后慢慢降下来速度，向我投回目光。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(1318, 90, 300, "护具", ["空间里轮滑鞋交替捶着地面，她向我冲来。", "这速度我无法招架，我只有张开双手去试图接住她。", "好在椅子的支撑力足够，小女孩扑进我的怀里，椅子的缓冲带着我们俩平移了一小段距离就停下了。", "她似乎滑了很久，轮辄在椅子周围形成圆圈。", "将视线掷向圆圈时，痕迹似乎还在发着被辄下时空寂的残响。", "曾在某个冬日的下午，在家门前的石墩上坐着时，谁人正清出一片空地打空竹。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(1250, 207, 300, "护具", ["红衣服的小女孩身上有刚洗净的衣香，在我怀里笑着。", "我感到她的形状与我的身体严丝合缝，仿佛从未分开。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(1278, 289, 300, "护具", ["小女孩的嘴巴一张一合，我却在这时听不见任何声音，只要我看向她的脸，就说不上来地梗塞。", "好似已经丢失了对这种语言的理解方式。", "我想：若能找回她说的话，我就能和她对上话。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(1300, 380, 300, "护具", ["抓着残冬的碎雪百思不得解……要不……出门找找？"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(191, 102, 300, "护具", ["随着我想起门，我才发现这房间里已经拥挤不堪，人、书、食物之类的全都挤在一起，这无限的空间居然也有满的时候。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return Promise.all([
                            StartShakeAllBoxes(),
                            TextBox(204, 325, 300, "护具", ["拥挤颤抖着。"], "#eee", "#fd2049")
                        ])
                    })
                    .then(([, [rect, text]]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(279, 382, 300, "护具", ["我就站在离门不远的位置，只要伸手，就可以握到门把手。", "周围的事物有了自己的属性，不再与我有关，而是相互使用，交流着。", "我不再想去阅读每一条消息，内脏快被挤出身体，再不出去的话我可能只剩皮囊。"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        return TextBox(296, 499, 300, "护具", ["逃命般地冲向门……"], "#eee", "#fd2049")
                    })
                    .then(([rect, text]) => {
                        return WaitForClick(rect, text)
                    })
                    .then(() => {
                        FinishTimeLine("护具")
                    })
            })
        })
        .then(() => {
            return Promise.all([
                TouchCircleNewWindowKeep(858, 471, "#809e88", "护具 1", "newtabs/护具 1.html", () => {
                    StopShakeAllBoxes()
                }),
                TouchCircleAndTime(917, 551, "#008000", "烤好了", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(917, 551, 300, "烤好了", ["叮——饼干烤好了，M9 去了卫生间，所以我代替他把饼干托盘取出来。", "热气和芳香扑鼻，我不由得微笑。"], "#eee", "#008000")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(1300, 551, 300, "烤好了", ["取出时一看，M9 做的饼干全都连成了一片，他把面团摊成了一个巨大的覆盖烤盘的圆形，而这圆形完美得像是要把周遭吞没。", "这奇异的形状让我思考这烤箱的温度和膨胀程度也被 M9 测算了吗。", "我思考时，M9 跑过来笑盈盈地说：「烤好了呀！」。"], "#eee", "#008000")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("烤好了")
                        })
                })
            ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(198, 96, "#7248c6", "我的饼干", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(198, 96, 300, "我的饼干", ["我烤制的饼干就是常理上的饼干了，大小各异，有些托盘边沿的烤糊了。"], "#eee", "#7248c6")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("我的饼干")
                        })
                    }),
                TouchCircleAndTime(605, 161, "#1b9423", "M9的饼干", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(605, 161, 300, "M9的饼干", ["M9 把他的饼干放在盘子上，但这饼干其实大过它的容器。"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(716, 282, 300, "M9的饼干", ["「想把这圆形落入腹中，要怎么做？」M9 边想边说，并拿出刀具。"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(682, 374, 300, "M9的饼干", ["「为什么要烤这么大一块呢？」"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(703, 434, 300, "M9的饼干", ["「我觉得这就是饼干最正常的大小哦。」"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(673, 518, 300, "M9的饼干", ["「但这么大，我们没法一次吃下的。」"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(720, 577, 300, "M9的饼干", ["「没关系，我把它再打散拆碎就是。」", "接着，M9 缓慢地用手中小刀在饼干上划着线条，之后用力一锤，小小的圆形从内部落下了。", "嗯，正好和我烤的饼干差不多大小。M9 居然连这样的事都能做到。"], "#eee", "#1b9423")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return FinishTimeLine("M9的饼干")
                        })
                    })
                ])
        })
        .then(() => {
            return Promise.all([
                TouchCircleAndTime(560, 252, "#049600", "液体的M9", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => {
                            return TextBox(560, 252, 300, "液体的M9", ["我感觉有虫子爬到了自己的后背，我用手拂过脖颈，但什么也没有。", "虫子或许已经离去了，有的只是无法拂去的脚印，看出它们也曾愉快地在树梢切割过叶片当美食。"], "#eee", "#049600")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => {
                            return TextBox(null, null, 300, "液体的M9", ["两条虫子在我的手背上交谈。头上的触角交叉挥舞着，进行了如下的闲谈。"], "#eee", "#049600")
                        })
                        .then(([rect, text]) => {
                            return WaitForClick(rect, text)
                        })
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「你想不想喝饮料？」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「好啊。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「我这里有牛奶、咖啡、葡萄汁，还有些方糖和燕麦片。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 350, "液体的M9", ["「听起来都不错，来一点牛奶和燕麦，配上巧克力饼干，好久都没有吃这样的下午茶了。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「你周末会做什么？」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 400, "液体的M9", ["「嗯……周日一早去物理研究所看望小孩，我那两个孩子在那里托管，周日上午把她俩带出来，去她俩想去的地方……", "嗯对，晚上再送回去。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「只见一天你小孩会不会想你。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「这个你放心，她俩中的姐姐可调皮了，一天到晚就带着妹妹上蹿下跳在所里捣乱，那里的义工还老冲我发牢骚来着，", "没见她俩有多想我。想的只是外出的机会吧。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「你像是把两个小孩当成好朋友一样。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 350, "液体的M9", ["「当然～我很期待见到她俩，工作日晚上下班早的话，也会溜出去给她俩买好吃的。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["原来都是小女孩。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「你家小孩怎么样？」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「他，现在在上小学呢，我每天晚上下班去托管班接他。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「哦，然后你到家再给孩子做晚饭？」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「嗯，随便做点。我丈夫一点家里事都不管……成天就是加班，很晚回来，第二天一早又走了，有时候抽着烟都能睡着。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["有次差点把被子点着了。你说他……忙什么呢。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 350, "液体的M9", ["「现在上个班真是拼生拼死。我们家那位——一天的工作时间是你的两倍不止，更何况他还像虫豸王一样多身体同时协作……", "百忙之中还不忘分一个来教训下属，我也很心疼的。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「这样算是一个大脑里有几个大脑？算了，想不明白。真有他的。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["说到底我也清楚，老板是最拼的那个，但这也不是他压榨员工的理由。我忍住了尖啸的冲动。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「你家小孩喜欢什么？」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 350, "液体的M9", ["「嗯……姐姐喜欢数学之类的，杂七杂八，爱好比较广泛；妹妹平时不太爱表达，但应该喜欢花草和小动物吧。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「哦……哦我家小孩有很好闻的气味、蓬松的羽毛、雪白肥满的身体……」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「嗯，一个黑不溜秋像是从牛屁股里挤出来的，还有一个白得能拉丝。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["「公司的停车库有很多这样的小孩。」"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["嘈杂地聊着天，已经无法确认正在对话的东西是两个什么。有可能是两块石头，也有可能是两片树叶。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["我厌倦了在这里记日记，也厌倦了回忆这些对话。让书页都变成了水滴，映着记录下的画面。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 400, "液体的M9", ["我在构想着有针线将水滴穿起来，将视野透过记忆的水滴来看世界，当我这样看时，周围的人类被声音和画面的崇高感受美化了。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["接着，我把水滴做成镜片放入眼睛，这份崇高便不会离开我身。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["很突然，但在这时作一首诗也好。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 450, "液体的M9", ["梦辗转拼饶反复无常／蚺蛇缘岩偲倏／藕池城人泥石刻／未见丝囊缎躇躇。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["这首诗之后，面前的 M9 变成了正在遗憾着的丈夫，他翻着地理图册，想象自己能到哪个场所，结果是哪个都去不了。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["脑中的齿轮奏着悲伤的噪音。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["我承认我确实忘记了很多事情。随着人的生长，事件只能留下记忆的余迹，而非完全解决掉。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["这些令人心烦的残缺时刻刺痛着我。若要从根本上解决，除了一死别无他法。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["在我之后，我的孩子也会遭遇一样的问题。我解决这些问题之后，我的孩子就能无憾地成长了。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["那么也不需要那些冗长的废话了，就在这里把所有症状起上名字吧。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 600, "液体的M9", ["{枣疫，峥嵘病，飞螨，可视光腺过敏，氧气不耐受，电器开并无力症，压力膀，脑路感染，泪潴留，耳蚺病毒，刺藓，异色头斑，余料可口症，恐圆症，过描写，两个小女孩成对出现症，食蓝癖，回首软化症，翘皮疣，椅子亢奋症，光过敏，不幸症，染风，过曝，疫疾……}"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["在编造名称时，我不知不觉地睡着了。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "液体的M9", ["在梦里也有视觉，所以镜片也有发挥作用。"], "#eee", "#049600"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => {
                            return FinishTimeLine("液体的M9")
                        })
                }),
                TouchCircleAndTime(124, 211, "#fffcdb", "梦中的M9", () => {
                    return new Promise((resolve, reject) => {
                        return resolve()
                    })
                        .then(() => TextBox(124, 211, 300, "梦中的M9", ["牛奶溢出了杯口，我又接连将整盒牛奶都洒在了厨房的桌子上，我和 M9 的衣服都被牛奶溅湿。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「没事吧，刚才怎么了？」", "M9 并没有被吓到，只是跑来关心我。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「哎……抱歉……真是对不起，走神了。」", "我下意识地弯腰道歉。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「没有的事，一起收拾吧，刚刚你在想什么？」", "M9 好像很关心我的思维活动。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["我处还在惊慌之中，因此没有回应。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["M9 轻抚我的后背，对我耳语着不要紧，不要紧。", "虽然没有用。复数个反胃感蔓延我的后背。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「要不还是来听会儿音乐吧。我有副新买的耳机，声音质量非常高。」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「请务必让我体验一下！」", "M9 双手交叉举起，摆出渴望的架势。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["M9 抓来屋内一把转椅，戴上了这副头戴式耳机。", "一瞬间，耳机将折叠的隔音元件展开，M9 都表示出震惊，连机器对机器都会认可的程度。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => Promise.all([
                            Sleep(60000),
                            ChangeBGM("assets/audios/合成器与植物Plant plays ambient music.m4a")
                        ]))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["我选了一首植物电子的合成音乐，M9 听得很陶醉，身体跟着摆动、像被风拨动的植物，不时还跟着哼唱曲调。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「好听，有微风的感觉。」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => Promise.all([
                            Sleep(60000),
                            ChangeBGM("assets/audios/Hamish Milne - Prelude and Fugue in D minor, BWV 539Prelude.mp3")
                        ]))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["我又选了一首复调钢琴曲，M9 把眼睛一会儿睁开、一会儿闭上，却不知道在看什么，有些恍惚。", "曲毕，他的眼眸流下泪水。", "「这首让我回忆起童年。」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["曲毕，我按下了随机播放键，一阵黑金属摇滚穿破耳机的屏障。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => Promise.all([
                            Sleep(60000),
                            ChangeBGM("assets/audios/Endless Wander.m4a")
                        ]))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["M9 低着头，我看到他变成黑色，变得模糊，焦距调整后和立在街边沉默的大树别无二致。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["黑色的哀悼巨树在我眼前三尺的距离，天色已晚，仔细看能看到蹙紧内部的流动物质。", "黑色分泌出来顺着树干流淌，汇聚成两个小小的胚珠在树干上停住，环抱在树上。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["M9 呆在原地，眼神短暂失焦。", "「哦……啊……好曲子。就是这首，别停。」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["适应了这个激烈的节奏，M9 继续听着。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["曲毕，M9 把耳机摘了下来。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => ChangeBGM("assets/audios/拉G二.m4a", 0.75))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["M9 的双耳孔，慢慢淌出血，像是把什么推了出去。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「别害怕，这是组织液，我身体表层有些这样像血的东西作覆盖……」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「爸爸！这声音太吵，我睡觉都被吵醒了！」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 500, "梦中的M9", ["M9 看到两个小孩时瞳孔亮了一下，重置了眼神追踪。", "热情洋溢地说「你们怎么来啦？」，擦了擦耳朵，胸肌膨胀气势高昂地先是俯身用脸紧贴孩子，又把两个小孩子搂进怀里，举过头顶转圈。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 450, "梦中的M9", ["「真是抱歉，把你们俩吵醒了。我可想你们了！但先在这里坐一会好吗，我正在陪姐姐聊天。」"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => TextBox(null, null, 300, "梦中的M9", ["「不要不要！我要爸爸陪我！」", "长头发的小女孩扯着 M9 的衣服，一边蹦跳一边撒娇。", "另一个孩子有些迟缓地笑着，仿佛 M9 成了世界的中心。"], "#333", "#fffcdb"))
                        .then(([rect, text]) => WaitForClick(rect, text))
                        .then(() => {
                            return FinishTimeLine("梦中的M9")
                        })
                })
            ])
        })
        .then(() => {
            return TouchCircleNewWindowKeep(255, 226, "#333", "气体的M9", "newtabs/气体的M9.html")
        })
        .then(() => {
            return Archivement(
                "assets/images/finished.png",
                "完成游戏！",
                "纳得幻肢的一切，真的吗？"
            )
        })
}

ChapterDemo()
