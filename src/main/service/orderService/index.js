class OrderService {
    // 获取订单列表
    getOrderList() {
        // 模拟数据
        const orderList = [
            { id: 1, userId: 1, amount: 150.00, status: 'pending' },
            { id: 2, userId: 2, amount: 200.00, status: 'paid' },
            { id: 3, userId: 3, amount: 75.50, status: 'paid' }
        ];

        return orderList;
    }

    // 分页获取订单列表
    getOrderListPage(page = 1, size = 10) {
        const orderList = this.getOrderList();

        const start = (page - 1) * size;
        const end = start + size;
        const paginatedList = orderList.slice(start, end);

        return {
            list: paginatedList,
            total: orderList.length,
            page: page,
            size: size
        };
    }

    // 根据账单状态分组订单
    getOrdersGroupedByBillStatus() {
        // 模拟按账单状态分组的数据
        const groupedData = {
            pending: [
                { id: 1, userId: 1, amount: 150.00 }
            ],
            paid: [
                { id: 2, userId: 2, amount: 200.00 },
                { id: 3, userId: 3, amount: 75.50 }
            ],
            overdue: []
        };

        return groupedData;
    }
}

module.exports = new OrderService();