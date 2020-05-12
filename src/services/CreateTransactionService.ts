import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactionWithSameCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (transactionWithSameCategory) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: transactionWithSameCategory.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transactionCategory = await categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(transactionCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
