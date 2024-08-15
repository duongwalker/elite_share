interface Transaction {
    from: string
    to: string
    amount: number
}

interface User {
    user_id: number
    name: string
    share_amount: number
}

export function settleDebts(users: User[]) {

    const debtors = users.filter(user => user.share_amount < 0);
    const creditors = users.filter(user => user.share_amount> 0);
    const transactions: Transaction[] = [];
    // console.log('debtors')
    // console.log(debtors)


    // Pair debtors with creditors and settle debts
    debtors.forEach(debtor => {
      while (debtor.share_amount < 0 && creditors.length > 0) {
        // console.log('creditors')
        // console.log(creditors)
        const creditor = creditors.reduce((a, b) => a.share_amount > b.share_amount ? a : b); // Find the creditor that lend the highest amount
        // console.log(creditor)
        const amount = Math.min(-debtor.share_amount, creditor.share_amount); //find the minimum amount that
        // console.log(amount)
        debtor.share_amount += amount;
        creditor.share_amount -= amount;
        transactions.push({ from: debtor.name, to: creditor.name, amount });
        if (creditor.share_amount === 0) {
          creditors.splice(creditors.indexOf(creditor), 1);
        }
      }
    });
    // console.log(transactions)
    return transactions;
}

