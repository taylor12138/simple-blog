---
author: Hello
categories: matlab
pubDate: 2020-08-06 
title: matlab期末知识点汇总
description: 'matlab相关'
---

# regress命令



  用于一元及多元线性回归

B = regress(Y,X)
[B,BINT] = regress(Y,X)
[B,BINT,R] = regress(Y,X)
[B,BINT,R,RINT] = regress(Y,X)
B,BINT,R,RINT,STATS] = regress(Y,X)
[...] = regress(Y,X,ALPHA)

B：回归系数，类似于斜率，是个向量（“the vector B of regression coefficients in the  linear model Y = X*B”）。
BINT：回归系数的区间估计（“a matrix BINT of 95% confidence intervals for B”）。
R：残差（ “a vector R of residuals”）。
RINT：置信区间（“a matrix RINT of intervals that can be used to diagnose outliers”）。
STATS：用于检验回归模型的统计量。有4个数值：判定系数R^2，接近1，回归方程越显著，F统计量观测值，F越大，回归方程越显著，检验的p的值，误差方差的估计。
ALPHA：显著性水平（缺少时为默认值0.05）。



```
 
%导入数据
y=[7613.51  7850.91  8381.86  9142.81 10813.6 8631.43 8124.94 9429.79 10230.81 
... 10163.61 9737.56 8561.06 7781.82 7110.97]';
x1=[7666 7704 8148 8571 8679 7704 6471 5870 5289 3815 3335 2927 2758 2591]';
x2=[16.22 16.85 17.93 17.28 17.23 17 19 18.22 16.3 13.37 11.62 10.36 9.83 9.25]';
X=[ones(size(y)) x1.^2 x2.^2 x1 x2 x1.*x2];
%  size（）：获取矩阵的行数和列数
%  s=size(A),
当只有一个输出参数时，返回一个行向量，该行向量的第一个元素时矩阵的行数，第二个元素是矩阵的列数。
%  ones(M,N)产生一个M*N的矩阵

%开始分析
[b,bint,r,rint,stats] = regress(y,X);
```



#### 创建残差的置信区间图

用regress返回的值r，rint：`rcoplot（r，rint）`



#### 线性回归模型类

```
线性回归模型类
wlb=LinearModel; %创建线性回归类对象，对象名wlb
wlb=LinearModel.fit(x,y); %创建线性回归类对象，并对观测
数据做多元线性回归
wlb.plot %绘制wlb的效果图
wlb.anova %给出方差分析表
[y,ly]=wlb.predict(x) %给出x预测和置信区间
wlb.plotResiduals %绘制残差图
wlb. plotDiagnoisetics(method) %绘制不同统计量的残差图分
析
properties(wlb) %显示所有统计量属性
```



## t值和显著性水平有什么样的对应关系

**t-检验：可以用于比较两组数据是否来自同一分布。（可以用于比较两组数据的区分度）**

在统计检验中，统计量t值和显著性水平具有什么样的对应关系？一般来说，大样本和正态分布情况下的数据，当1.65<|t|<1.96时,p<0.10;当1.96<|t|<2.58时，p<0.05；|t|大于2.58时，p<0.01。

 但是要注意的是，当样本量很小（小于30），数据分布形态不明或明显不服从正态分布（一座山一样的分布）时，t值和显著性水平不一定完全对应，例如t值绝对值大于2时，p值有可能大于0.05，也就是不显著。这种情况一般要采用非参数检验的方法，而不是t检验。



1、t值，指的是T检验，主要用于样本含量较小（例如n<30），总体标准差σ未知的正态分布资料。T检验是用t分布理论来推论差异发生的概率，从而比较两个平均数的差异是否显著。

2、P值，就是当原假设为真时，所得到的样本观察结果或更极端结果出现的概率。如果P值很小，说明原假设情况的发生的概率很小，而如果出现了，根据小概率原理，我们就有理由拒绝原假设，P值越小，我们拒绝原假设的理由越充分。

p值代表的是不接受原假设的最小的显著性水平，可以与选定的显著性水平直接比较。例如取5%的显著性水平，如果P值大于5%，就接受原假设，否则不接受原假设。这样不用计算t值，不用查表。

3、P值能直接跟显著性水平比较；而t值想要跟显著性水平比较，就得换算成P值，或者将显著性水平换算成t值。在相同自由度下，查t表所得t统计量值越大，其尾端概率P越小，两者是此消彼长的关系，但不是直线型负相关

#### 怎么得到检验回归系数显著性的T值

对于X、Y两个正态总体的样本，其[t检验](https://www.baidu.com/s?wd=t检验&tn=SE_PcZhidaonwhc_ngpagmjz&rsv_dl=gh_pc_zhidao)应使用ttest2()函数来检验假设。
[H,P,CI]=ttest2(X,Y)

ttest2（）函数是用来检验具有相同方差的两个正态总体均值差的假设检验（即两正态总体的检验法）。

基本调用格式：

```
h=ttest2（x，y）判断来自不同正态总体的样本数据x与y是否有相同的均值。当h=0表示接受原假设，当h=1表示拒绝原假设。

h=ttest2（x，y，alpha）调用格式表示执行显著性水平为（100*alpha）%的假设检验。没有给出alpha值，默认alpha=0.05。

h=ttest2（x，y，alpha，tail）调用格式表示执行以tail指定的备择假设作假设检验，原假设为均值等于m，当tail=‘both’时表明备择假设为“x与y均值不相等”，当tail=‘right’时表明备择假设为“x的均值大于y的均值”，当tail=‘left’时表明备择假设为“x的均值小于y的均值”。
```





## regstats函数（回归系数显著性检测？）

MATLAB统计工具箱中提供了regstats函数，也可用来作多重线性或广义线性回归分析，它的调用方式如下：
regstats(y,X,model)
stats = regstats(…)
stats = regstats(y,X,model,whichstats)





## 非线性

用nlinfit函数或者开启cftool工具箱



## eye函数

该函数返回单位矩阵。

Y = eye(n)：返回n*n单位矩阵；

Y = eye(m,n)：返回m*n单位矩阵；